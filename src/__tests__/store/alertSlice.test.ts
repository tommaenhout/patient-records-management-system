import alertReducer, { showAlert, hideAlert, clearAlert, type AlertState } from '../../store/slices/alertSlice';

describe('alertSlice', () => {
  const initialState: AlertState = {
    message: '',
    isVisible: false,
    duration: 3,
    isSuccess: false,
  };

  it('should return the initial state', () => {
    expect(alertReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('showAlert', () => {
    it('shows alert with message only', () => {
      const action = showAlert({ message: 'Test message' });
      const state = alertReducer(initialState, action);

      expect(state).toEqual({
        message: 'Test message',
        isVisible: true,
        duration: 3,
        isSuccess: false,
      });
    });

    it('shows success alert with custom duration', () => {
      const action = showAlert({ 
        message: 'Success message', 
        isSuccess: true, 
        duration: 5 
      });
      const state = alertReducer(initialState, action);

      expect(state).toEqual({
        message: 'Success message',
        isVisible: true,
        duration: 5,
        isSuccess: true,
      });
    });

    it('shows error alert with default values', () => {
      const action = showAlert({ 
        message: 'Error message', 
        isSuccess: false 
      });
      const state = alertReducer(initialState, action);

      expect(state).toEqual({
        message: 'Error message',
        isVisible: true,
        duration: 3,
        isSuccess: false,
      });
    });

    it('overwrites existing alert', () => {
      const existingState: AlertState = {
        message: 'Old message',
        isVisible: true,
        duration: 5,
        isSuccess: true,
      };

      const action = showAlert({ message: 'New message' });
      const state = alertReducer(existingState, action);

      expect(state).toEqual({
        message: 'New message',
        isVisible: true,
        duration: 3,
        isSuccess: false,
      });
    });
  });

  describe('hideAlert', () => {
    it('hides visible alert', () => {
      const visibleState: AlertState = {
        message: 'Test message',
        isVisible: true,
        duration: 3,
        isSuccess: false,
      };

      const action = hideAlert();
      const state = alertReducer(visibleState, action);

      expect(state).toEqual({
        message: 'Test message',
        isVisible: false,
        duration: 3,
        isSuccess: false,
      });
    });

    it('keeps alert hidden when already hidden', () => {
      const action = hideAlert();
      const state = alertReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('clearAlert', () => {
    it('clears all alert data', () => {
      const activeState: AlertState = {
        message: 'Active message',
        isVisible: true,
        duration: 10,
        isSuccess: true,
      };

      const action = clearAlert();
      const state = alertReducer(activeState, action);

      expect(state).toEqual(initialState);
    });

    it('resets to initial state when already cleared', () => {
      const action = clearAlert();
      const state = alertReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('action creators', () => {
    it('creates showAlert action with required payload', () => {
      const action = showAlert({ message: 'Test' });
      
      expect(action.type).toBe('alert/showAlert');
      expect(action.payload).toEqual({ message: 'Test' });
    });

    it('creates showAlert action with full payload', () => {
      const payload = { message: 'Test', isSuccess: true, duration: 5 };
      const action = showAlert(payload);
      
      expect(action.type).toBe('alert/showAlert');
      expect(action.payload).toEqual(payload);
    });

    it('creates hideAlert action', () => {
      const action = hideAlert();
      
      expect(action.type).toBe('alert/hideAlert');
      expect(action.payload).toBeUndefined();
    });

    it('creates clearAlert action', () => {
      const action = clearAlert();
      
      expect(action.type).toBe('alert/clearAlert');
      expect(action.payload).toBeUndefined();
    });
  });

  describe('state transitions', () => {
    it('handles show -> hide -> clear sequence', () => {
      let state = alertReducer(initialState, showAlert({ message: 'Test', isSuccess: true }));
      expect(state.isVisible).toBe(true);
      expect(state.message).toBe('Test');

      state = alertReducer(state, hideAlert());
      expect(state.isVisible).toBe(false);
      expect(state.message).toBe('Test'); // message should still be there

      state = alertReducer(state, clearAlert());
      expect(state).toEqual(initialState);
    });

    it('handles multiple showAlert calls', () => {
      let state = alertReducer(initialState, showAlert({ message: 'First', duration: 5 }));
      expect(state.message).toBe('First');
      expect(state.duration).toBe(5);

      state = alertReducer(state, showAlert({ message: 'Second', isSuccess: true }));
      expect(state.message).toBe('Second');
      expect(state.duration).toBe(3); // reset to default
      expect(state.isSuccess).toBe(true);
    });
  });
});
