import { ref } from 'vue';

import type { AxiosResponse } from 'axios';

const useFetch = <
  T extends (...params: Parameters<T>) => Promise<AxiosResponse>,
>(
  method: T,
  ...params: Parameters<T>
) => {
  const data = ref<Awaited<ReturnType<T>>['data']>();
  const error = ref();
  const isLoading = ref(false);

  async function fetchData() {
    isLoading.value = true;
    try {
      const { data: _data } = await method(...params);
      data.value = _data;
      error.value = undefined;
    } catch (err) {
      data.value = undefined;
      error.value = err;
    }
    isLoading.value = false;
  }
  fetchData();

  return { isLoading, error, data };
};

export default useFetch;
