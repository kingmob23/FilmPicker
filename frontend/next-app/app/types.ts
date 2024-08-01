import { Control, UseFormRegister } from 'react-hook-form';


export interface Username {
    name: string;
    type: string;
    refresh: boolean;
  }

export interface FormData {
    usernames: Username[];
  }

export  interface UsernamesContextType {
    usernames: Username[];
    setUsernames: React.Dispatch<React.SetStateAction<Username[]>>;
  }

export interface UsernameFieldProps {
    control: Control<any>;
    register: UseFormRegister<any>;
    index: number;
    field: any;
    remove: (index: number) => void;
    setTypeToLB: (index: number) => void;
    errors: any;
  }
