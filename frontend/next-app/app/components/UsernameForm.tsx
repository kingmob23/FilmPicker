'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, FieldError, useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as Yup from 'yup';

interface UsernameField {
  name: string;
  type: string;
  refresh: boolean;
}

interface FormData {
  usernames: UsernameField[];
}

const schema = Yup.object().shape({
  usernames: Yup.array()
    .of(Yup.object().shape({
      name: Yup.string().required('Username is required'),
      type: Yup.string().required('Type is required'),
      refresh: Yup.boolean(),
    }))
    .min(1, 'At least one username is required')
});

const UsernameForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, formState: { errors }, register, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { usernames: [{ name: '', type: '', refresh: false }] }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'usernames'
  });

  useEffect(() => {
    console.log("UsernameForm: Component mounted or updated");
  }, [fields]);

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log("UsernameForm: Submitting data:", data);

    try {
      const payload = {
        requestId: Date.now(),
        usernames: data.usernames.map(username => ({
          name: username.name,
          type: username.type,
          refresh: username.refresh,
        }))
      };

      console.log('UsernameForm: Gathered data:', JSON.stringify(payload));

      const response = await fetch('http://localhost:8000/scrape/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('UsernameForm: Received result:', result);

        const query = {
          usernames: JSON.stringify(data.usernames),
          intersection: JSON.stringify(result.intersection),
          intersectionLen: result.intersection_len,
        };

        const queryString = new URLSearchParams(query).toString();
        router.push(`/subpages/results?${queryString}`);
      } else {
        const error = await response.json();
        console.error('UsernameForm: Failed to submit usernames:', error);
      }
    } catch (error) {
      console.error('UsernameForm: An error occurred while submitting usernames', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUsername = () => {
    const usernames = getValues('usernames') ?? [];
    const lastUsername = usernames[usernames.length - 1] ?? { name: '', type: '', refresh: false };

    if (lastUsername.name.trim() !== '') {
      append({ name: '', type: '', refresh: false });
    }
  };

  const isFieldError = (error: any): error is FieldError => error?.message !== undefined;

  return (
    <Container>
      <h1>Enter Usernames</h1>
      <p>*Integration with kinopoisk is not actually working. Fucking capchka!</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
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
              render={({ field }) => (
                <Input {...field} />
              )}
            />
            <Button type="button" onClick={() => remove(index)}>Delete</Button>
            {isFieldError(errors.usernames?.[index]?.name) && <Error>{errors.usernames[index].name.message}</Error>}
            {isFieldError(errors.usernames?.[index]?.type) && <Error>{errors.usernames[index].type.message}</Error>}
            {isFieldError(errors.usernames?.[index]?.refresh) && <Error>{errors.usernames[index].refresh.message}</Error>}
          </FieldContainer>
        ))}
        <Button type="button" onClick={handleAddUsername}>Add Username</Button>
        <Button type="submit" disabled={isSubmitting}>Submit</Button>
      </form>
    </Container>
  );
};

export default UsernameForm;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`;

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
