import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as Yup from 'yup';
import { UsernamesContext } from '../context/UsernamesContext';
import { FormData } from '../types';
import { handleSubmitData } from '../utilities/submitHandler';
import UsernameField from './UsernameField';

const schema = Yup.object().shape({
  usernames: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Username is required'),
        type: Yup.string().oneOf(['LB', 'KP']).required('Type is required'),
        refresh: Yup.boolean(),
      })
    )
    .min(1, 'At least one username is required'),
});

const UsernameForm = () => {
  const { setUsernames } = useContext(UsernamesContext) || { setUsernames: () => {} };
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [delayMessage, setDelayMessage] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    getValues,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: { usernames: [{ name: '', type: 'LB', refresh: false }] },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'usernames',
  });

  const handleAddUsername = () => {
    const usernames = getValues('usernames') ?? [];
    const lastUsername = usernames[usernames.length - 1] ?? {
      name: '',
      type: 'LB',
      refresh: false,
    };

    if (lastUsername.name.trim() !== '') {
      append({ name: '', type: 'LB', refresh: false });
      setMessage('');
    } else {
      setMessage('Please complete the current username field before adding a new one.');
    }
  };

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    setUsernames(data.usernames);
    let delayTimer = setTimeout(() => {
      setDelayMessage('The initial loading or update may take some time.');
    }, 1000);

    handleSubmitData(data, isSubmitting, setIsSubmitting, router).finally(() => {
      clearTimeout(delayTimer);
      setIsSubmitting(false);
      setDelayMessage('');
    });
  };

  const setTypeToLB = (index: number) => {
    setMessage('Integration with kinopoisk is not yet working. CAPTCHA issue!');
    setValue(`usernames.${index}.type`, 'LB');
  };

  return (
    <Container>
      <h1>Enter Usernames</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <UsernameField
            key={field.id}
            control={control}
            register={register}
            index={index}
            field={field}
            remove={remove}
            setTypeToLB={setTypeToLB}
            errors={errors}
          />
        ))}
        {message && <Message>{message}</Message>}
        {delayMessage && <Message>{delayMessage}</Message>}
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

const Message = styled.p`
  color: red;
  font-size: 14px;
`;
