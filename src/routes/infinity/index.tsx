import { $, component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { QueryClient } from '@tanstack/query-core';
import {
	useQuery,
	useIsFetching,
	useMutation,
	useInfiniteQuery,
} from '~/qwik-query';
import { createQueryClient } from '~/qwik-query/useQueryClient';
import { queryClientState } from '~/qwik-query/utils';

export const queryFuntion = $(async (): Promise<Array<any>> => {
	const response = await fetch('https://jsonplaceholder.typicode.com/users', {
		method: 'GET',
	});
	return response.json();
});

const queryKey = ['post'];

export const useRouteLoader = routeLoader$(async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery({
		queryKey,
		queryFn: $(async (): Promise<Array<any>> => {
			const response = await fetch(
				'https://jsonplaceholder.typicode.com/users',
				{
					method: 'GET',
				}
			);
			return response.json();
		}),
	});
	return queryClientState(queryClient);
});

export default component$(() => {
	const queryStore = useInfiniteQuery(
		{
			queryKey,
			queryFn: queryFuntion,
			getPreviousPageParam: $(() => {
				console.log('getPreviousPageParam');
			}),
			getNextPageParam: $(() => {
				console.log('getNextPageParam');
			}),
		},
		useRouteLoader().value
	);
	const isFetchingSig = useIsFetching();
	return (
		<div>
			<button
				onClick$={() => {
					queryStore.options.getNextPageParam()
				}}
			>
				getNextPageParam
			</button>
			<br></br>
			isFetch: {isFetchingSig.value}
			<br></br>
			Status: {queryStore.result.status} <br></br>
			Lenght: {queryStore.result.data.length}
		</div>
	);
});