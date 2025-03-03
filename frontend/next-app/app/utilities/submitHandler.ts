import { FormData } from '../types';

export const handleSubmitData = async (
  data: FormData,
  isSubmitting: boolean,
  setIsSubmitting: (isSubmitting: boolean) => void,
  router: any
) => {
  if (isSubmitting) return;
  setIsSubmitting(true);
  console.log("submitHandler: Submitting data:", data);

  try {
    const payload = {
      requestId: Date.now(),
      usernames: data.usernames.map(username => ({
        name: username.name,
        type: username.type,
        refresh: username.refresh,
      }))
    };

    console.log('submitHandler: Gathered data:', JSON.stringify(payload));

    const response = await fetch('/api/scrape/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('submitHandler: Received result:', result);

      const query = {
        usernames: JSON.stringify(data.usernames),
        intersection: JSON.stringify(result.intersection),
        intersectionLen: result.intersection_len,
      };

      const queryString = new URLSearchParams(query).toString();
      router.push(`/subpages/results?${queryString}`);
    } else {
      const error = await response.json();
      console.error('submitHandler: Failed to submit usernames:', error);
    }
  } catch (error) {
    console.error('submitHandler: An error occurred while submitting usernames', error);
  } finally {
    setIsSubmitting(false);
  }
};
