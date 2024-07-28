import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as Yup from 'yup';
import { handleSubmitData } from '../utilities/submitHandler';
import UsernameField from './UsernameField';

export interface Username {
  name: string;
  type: string;
  refresh: boolean;
}

export interface FormData {
  usernames: Username[];
}

const schema = Yup.object().shape({
  usernames: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Username is required'),
        type: Yup.string().required('Type is required'),
        refresh: Yup.boolean(),
      })
    )
    .min(1, 'At least one username is required'),
});

const UsernameForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    getValues,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { usernames: [{ name: '', type: '', refresh: false }] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'usernames',
  });

  useEffect(() => {
    console.log('UsernameForm: Component mounted or updated');
  }, [fields]);

  const handleAddUsername = () => {
    const usernames = getValues('usernames') ?? [];
    const lastUsername = usernames[usernames.length - 1] ?? {
      name: '',
      type: '',
      refresh: false,
    };

    if (lastUsername.name.trim() !== '') {
      append({ name: '', type: '', refresh: false });
    }
  };

  return (
    <Container>
      <h1>Enter Usernames</h1>
      <p>*Integration with kinopoisk is not actually working. Fucking capchka!</p>
      <form onSubmit={handleSubmit((data) => handleSubmitData(data, isSubmitting, setIsSubmitting, router))}>
        {fields.map((field, index) => (
          <UsernameField
            key={field.id}
            control={control}
            register={register}
            index={index}
            field={field}
            remove={remove}
            errors={errors}
          />
        ))}
        <Button type="button" onClick={handleAddUsername}>
          Add Username
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default UsernameForm;

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`;
