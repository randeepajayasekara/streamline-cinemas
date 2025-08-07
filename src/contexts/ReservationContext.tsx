import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Seat {
  id: string;
  type: 'balcony' | 'ground';
  price: number;
  isSelected: boolean;
  isReserved: boolean;
}

export interface ReservationData {
  movie: string;
  date: string;
  time: string;
  experience: string;
  seats: Seat[];
  totalPrice: number;
  movieThumbnail?: string;
  reservationId?: string;
  userEmail?: string;
  timestamp?: Date;
}

interface ReservationState {
  currentStep: number;
  reservationData: ReservationData;
}

type ReservationAction =
  | { type: 'SET_SHOWTIME'; payload: { movie: string; date: string; time: string; experience: string; movieThumbnail?: string } }
  | { type: 'SET_SEATS'; payload: { seats: Seat[]; totalPrice: number } }
  | { type: 'COMPLETE_RESERVATION'; payload: { reservationId: string; userEmail: string; timestamp: Date } }
  | { type: 'RESET_RESERVATION' }
  | { type: 'SET_STEP'; payload: number };

const initialState: ReservationState = {
  currentStep: 1,
  reservationData: {
    movie: '',
    date: '',
    time: '',
    experience: '',
    seats: [],
    totalPrice: 0,
  },
};

const reservationReducer = (state: ReservationState, action: ReservationAction): ReservationState => {
  switch (action.type) {
    case 'SET_SHOWTIME':
      return {
        ...state,
        currentStep: 2,
        reservationData: {
          ...state.reservationData,
          ...action.payload,
        },
      };
    case 'SET_SEATS':
      return {
        ...state,
        currentStep: 3,
        reservationData: {
          ...state.reservationData,
          seats: action.payload.seats,
          totalPrice: action.payload.totalPrice,
        },
      };
    case 'COMPLETE_RESERVATION':
      return {
        ...state,
        currentStep: 4,
        reservationData: {
          ...state.reservationData,
          ...action.payload,
        },
      };
    case 'RESET_RESERVATION':
      return initialState;
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    default:
      return state;
  }
};

interface ReservationContextType {
  state: ReservationState;
  setShowtimeData: (data: { movie: string; date: string; time: string; experience: string; movieThumbnail?: string }) => void;
  setSeatsData: (data: { seats: Seat[]; totalPrice: number }) => void;
  completeReservation: (data: { reservationId: string; userEmail: string; timestamp: Date }) => void;
  resetReservation: () => void;
  setStep: (step: number) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reservationReducer, initialState);

  const setShowtimeData = (data: { movie: string; date: string; time: string; experience: string; movieThumbnail?: string }) => {
    dispatch({ type: 'SET_SHOWTIME', payload: data });
  };

  const setSeatsData = (data: { seats: Seat[]; totalPrice: number }) => {
    dispatch({ type: 'SET_SEATS', payload: data });
  };

  const completeReservation = (data: { reservationId: string; userEmail: string; timestamp: Date }) => {
    dispatch({ type: 'COMPLETE_RESERVATION', payload: data });
  };

  const resetReservation = () => {
    dispatch({ type: 'RESET_RESERVATION' });
  };

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  return (
    <ReservationContext.Provider value={{
      state,
      setShowtimeData,
      setSeatsData,
      completeReservation,
      resetReservation,
      setStep,
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = (): ReservationContextType => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};
