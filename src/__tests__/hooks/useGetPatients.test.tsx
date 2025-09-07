import { renderHook, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { useGetPatients } from '../../hooks/useGetPatients';
import patientsReducer from '../../store/slices/patientsSlice';
import alertReducer from '../../store/slices/alertSlice';
import type { PatientRecord } from '../../interfaces/patient';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock useAlert hook
const mockShowAlert = jest.fn();
jest.mock('../../hooks/useAlert', () => ({
  useAlert: () => ({
    showAlert: mockShowAlert,
  }),
}));

// Mock AbortController
const mockAbort = jest.fn();
const mockAbortController = {
  signal: { 
    aborted: false,
    onabort: null,
    reason: undefined,
    throwIfAborted: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  },
  abort: mockAbort,
};
global.AbortController = jest.fn().mockImplementation(() => mockAbortController);

const mockPatients: PatientRecord[] = [
  {
    id: '1',
    name: 'John Doe',
    description: 'Test patient 1',
    website: 'https://example.com',
    avatar: 'https://example.com/avatar1.jpg',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    description: 'Test patient 2',
    website: 'https://example2.com',
    avatar: 'https://cloudflare-ipfs.com/invalid-avatar.jpg', // This should be filtered out
    createdAt: '2024-01-02T00:00:00Z'
  }
];

const createTestStore = () => {
  return configureStore({
    reducer: {
      patients: patientsReducer,
      alert: alertReducer,
    },
  });
};

type TestStore = ReturnType<typeof createTestStore>;

describe('useGetPatients', () => {
  let store: TestStore;

  const renderHookWithProvider = () => {
    store = createTestStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    return renderHook(() => useGetPatients(), { wrapper });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockShowAlert.mockClear();
    mockAbort.mockClear();
    mockAbortController.signal.aborted = false;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('successful API calls', () => {
    it('should fetch patients successfully and update store', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatients,
      });

      const { result } = renderHookWithProvider();

      // Initially loading should be true
      expect(result.current.loading).toBe(true);
      expect(result.current.patients).toEqual([]);

      // Wait for the fetch to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Verify fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledWith(
        'https://63bedcf7f5cfc0949b634fc8.mockapi.io/users',
        {
          signal: mockAbortController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Verify patients were updated in store (cloudflare avatar should be filtered out)
      const expectedPatients = [
        mockPatients[0],
        {
          ...mockPatients[1],
          avatar: undefined, // cloudflare-ipfs.com avatar should be filtered out
        }
      ];
      expect(result.current.patients).toEqual(expectedPatients);
      expect(mockShowAlert).not.toHaveBeenCalled();
    });

    it('should handle patients with valid avatars', async () => {
      const patientsWithValidAvatars = [
        {
          id: '1',
          name: 'John Doe',
          avatar: 'https://example.com/avatar.jpg',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://another-cdn.com/avatar.jpg',
          createdAt: '2024-01-02T00:00:00Z'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => patientsWithValidAvatars,
      });

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.patients).toEqual(patientsWithValidAvatars);
    });

    it('should handle patients with no avatars', async () => {
      const patientsWithoutAvatars = [
        {
          id: '1',
          name: 'John Doe',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => patientsWithoutAvatars,
      });

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.patients).toEqual(patientsWithoutAvatars);
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockShowAlert).toHaveBeenCalledWith('HTTP error! status: 404', false);
      expect(result.current.patients).toEqual([]);
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockShowAlert).toHaveBeenCalledWith('Network error', false);
      expect(result.current.patients).toEqual([]);
    });

    it('should handle non-Error exceptions', async () => {
      mockFetch.mockRejectedValueOnce('String error');

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockShowAlert).toHaveBeenCalledWith(
        'An unexpected error occurred while fetching patients',
        false
      );
    });

    it('should handle AbortError without showing alert', async () => {
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValueOnce(abortError);

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockShowAlert).not.toHaveBeenCalled();
    });
  });

  describe('abort signal handling', () => {
    it('should not update state when request is aborted', async () => {
      mockAbortController.signal.aborted = true;
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatients,
      });

      const { result } = renderHookWithProvider();

      // Wait a bit to ensure any async operations complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // State should not be updated when aborted
      expect(result.current.patients).toEqual([]);
      // Loading should remain true since setLoading(false) is skipped when aborted
      expect(result.current.loading).toBe(true);
    });

    it('should not show alert when request is aborted during error', async () => {
      mockAbortController.signal.aborted = true;
      mockFetch.mockRejectedValueOnce(new Error('Some error'));

      renderHookWithProvider();

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(mockShowAlert).not.toHaveBeenCalled();
    });
  });

  describe('refetch functionality', () => {
    it('should refetch data when refetch is called', async () => {
      // Initial fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPatients[0]],
      });

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.patients).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Refetch with new data
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatients,
      });

      act(() => {
        result.current.refetch();
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      await waitFor(() => {
        expect(result.current.patients).toHaveLength(2);
      });
    });

    it('should handle refetch errors', async () => {
      // Initial successful fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockPatients[0]],
      });

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Refetch with error
      mockFetch.mockRejectedValueOnce(new Error('Refetch error'));

      act(() => {
        result.current.refetch();
      });

      await waitFor(() => {
        expect(mockShowAlert).toHaveBeenCalledWith('Refetch error', false);
      });
    });
  });

  describe('cleanup on unmount', () => {
    it('should abort request on unmount', () => {
      const { unmount } = renderHookWithProvider();

      unmount();

      expect(mockAbort).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('should set loading to true at start of fetch', async () => {
      let resolvePromise: (value: unknown) => void;
      const fetchPromise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      mockFetch.mockReturnValueOnce(fetchPromise);

      const { result } = renderHookWithProvider();

      // Should be loading initially
      expect(result.current.loading).toBe(true);

      // Resolve the promise
      act(() => {
        resolvePromise({
          ok: true,
          json: async () => mockPatients,
        });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set loading to false after successful fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatients,
      });

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should set loading to false after failed fetch', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Fetch failed'));

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('avatar filtering', () => {
    it('should filter out cloudflare-ipfs.com avatars', async () => {
      const patientsWithCloudflareAvatars = [
        {
          id: '1',
          name: 'John Doe',
          avatar: 'https://cloudflare-ipfs.com/ipfs/QmSomeHash/avatar.jpg',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Jane Smith',
          avatar: 'https://example.com/avatar.jpg',
          createdAt: '2024-01-02T00:00:00Z'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => patientsWithCloudflareAvatars,
      });

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.patients[0].avatar).toBeUndefined();
      expect(result.current.patients[1].avatar).toBe('https://example.com/avatar.jpg');
    });

    it('should keep non-string avatars unchanged', async () => {
      const patientsWithObjectAvatars = [
        {
          id: '1',
          name: 'John Doe',
          avatar: {},
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => patientsWithObjectAvatars,
      });

      const { result } = renderHookWithProvider();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.patients[0].avatar).toEqual({});
    });
  });
});
