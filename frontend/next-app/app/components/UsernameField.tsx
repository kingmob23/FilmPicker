import React from 'react';
import { Control, Controller, FieldError, UseFormRegister } from 'react-hook-form';
import styled from 'styled-components';

interface UsernameFieldProps {
  control: Control<any>; // Adjust 'any' to your specific form data type if needed
  register: UseFormRegister<any>; // Adjust 'any' to your specific form data type if needed
  index: number;
  field: any; // Adjust 'any' to the specific field type if needed
  remove: (index: number) => void;
  errors: any; // Adjust 'any' to the specific error type if needed
}

const UsernameField: React.FC<UsernameFieldProps> = ({
  control,
  register,
  index,
  field,
  remove,
  errors,
}) => {
  const isFieldError = (error: any): error is FieldError => error?.message !== undefined;

  return (
    <FieldContainer key={field.id}>
      <Controller
        name={`usernames.${index}.type`}
        control={control}
        render={({ field }) => (
          <ControlsContainer>
            <div>
              <label>
                <input
                  type="radio"
                  value="kp"
                  checked={field.value === 'kp'}
                  onChange={() => field.onChange('kp')}
                />
                KP
              </label>
              <label>
                <input
                  type="radio"
                  value="lb"
                  checked={field.value === 'lb'}
                  onChange={() => field.onChange('lb')}
                />
                LB
              </label>
              <label>
                <input
                  type="radio"
                  value="ayz"
                  checked={field.value === 'ayz'}
                  onChange={() => field.onChange('ayz')}
                />
                ayz
              </label>
            </div>
            <label>
              <input type="checkbox" {...register(`usernames.${index}.refresh`)} />
              Refresh
            </label>
          </ControlsContainer>
        )}
      />
      <Controller
        name={`usernames.${index}.name`}
        control={control}
        render={({ field }) => <Input {...field} />}
      />
      <Button type="button" onClick={() => remove(index)}>
        Delete
      </Button>
      {isFieldError(errors.usernames?.[index]?.name) && <Error>{errors.usernames[index].name.message}</Error>}
      {isFieldError(errors.usernames?.[index]?.type) && <Error>{errors.usernames[index].type.message}</Error>}
      {isFieldError(errors.usernames?.[index]?.refresh) && <Error>{errors.usernames[index].refresh.message}</Error>}
    </FieldContainer>
  );
};

export default UsernameField;

const FieldContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`;

const Input = styled.input`
  margin: 10px;
  padding: 10px;
  font-size: 16px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;

const Error = styled.span`
  color: red;
  font-size: 14px;
  margin-top: -10px;
`;
