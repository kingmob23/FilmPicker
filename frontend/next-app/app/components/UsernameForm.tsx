'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as Yup from 'yup';

interface FormData {
  usernames: string[];
}

const schema = Yup.object().shape({
  usernames: Yup.array()
    .of(Yup.string().required('Username is required'))
    .min(1, 'At least one username is required')
});

const UsernameForm = () => {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { usernames: [''] }
  });

  const { fields, append } = useFieldArray({
    control,
    name: 'usernames'
  });

  const onSubmit = async (data: FormData) => {
    console.log('Submitting usernames:', data.usernames);
    try {
      const response = await fetch('http://localhost:8000/scrape/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernames: data.usernames })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Received result:', result);
        router.push(`/subpages/results?usernames=${encodeURIComponent(JSON.stringify(data.usernames))}`);
      } else {
        console.error('Failed to submit usernames');
      }
    } catch (error) {
      console.error('An error occurred while submitting usernames', error);
    }
  };

  return (
    <Container>
      <h1>Enter Usernames</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={field.id}>
            <Controller
              name={`usernames.${index}`}
              control={control}
              render={({ field }) => (
                <Input {...field} />
              )}
            />
            {errors.usernames?.[index] && <Error>{errors.usernames[index]?.message}</Error>}
          </div>
        ))}
        <Button type="button" onClick={() => append('')}>Add Username</Button>
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
