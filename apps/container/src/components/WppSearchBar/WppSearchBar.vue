    <template>
        <FeedbackAlert v-if="isErrorComponents" text="Erro ao buscar disciplinas" />
        <div class="wrapper w-100 mb-5">
            <v-text-field v-model="query" @input="onChangeQuery" variant="solo"
                placeholder="Digite o nome da disciplina" class="mb-1" hide-details :prepend-inner-icon="isFetchingComponents
                    ? 'mdi-loading mdi-spin'
                    : 'mdi-magnify'
                    " clearable @click:clear="clear">
            </v-text-field>
            <v-list v-if="processedResults.length && router.currentRoute.value.query.q" class="results" elevation="1">
                <v-list-item v-for="item in processedResults" :key="item.id" variant="plain"
                    @click="enterSearch(item.link)"
                    class="item px-0 py-3 d-flex flex-column align-start hover:bg-grey-lighten-4 rounded-lg transition-all"
                    role="button">
                    <div class="d-flex align-center mb-1">
                        <v-icon icon="mdi-whatsapp" class="mr-2 text-green" />
                        <span class="text-body-1 font-weight-medium">{{ item.name }}</span>
                    </div>
                    <div class="text-caption text-grey-darken-1">
                        <strong>Turma:</strong> {{ item.turma }} | <strong>Campus:</strong> {{ item.campus }}
                    </div>
                    <div class="text-caption text-blue mt-1">
                        👉 Clique para abrir o grupo
                    </div>
                </v-list-item>
            </v-list>
        </div>
    </template>

//verificar se funciona para usuario nao autenticado

<style scoped lang="scss">
.wrapper {
    position: relative;
    width: 100%;
}

.wrapper:focus-within .results {
    display: block;
}

.results {
    position: absolute;
    width: 100%;
    max-height: 320px;
    overflow-y: auto;
    border-radius: 4px;
    display: none;
    z-index: 9999;
}
</style>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import debounce from 'lodash.debounce';
import { Wpp } from 'services';
import { computed, onMounted, ref } from 'vue';
import { FeedbackAlert } from '@/components/FeedbackAlert';
import type { SearchComponentItem } from 'types';
import { useRouter } from 'vue-router';

const router = useRouter();
const query = computed({
    get: () => router.currentRoute.value.query.q as string,
    set: () => { },
});

const clear = () => {
    router.replace({
        name: 'wpp',
    });
};

const enterSearch = (link: string) => {
    (document.activeElement as HTMLDivElement)?.blur();

    window.open(link, '_blank');
};

const debouncedQuery = ref('');
const enableQuery = computed(() => !!debouncedQuery.value);

const {
    isError: isErrorComponents,
    isFetching: isFetchingComponents,
    data: searchResultsComponents,
} = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['wpp', 'search', debouncedQuery],
    queryFn: () => Wpp.searchComponents(debouncedQuery.value),
    enabled: enableQuery,
});

const handleUpdateDebouncedQuery = debounce(() => {
    debouncedQuery.value = query.value;
}, 500);

const onChangeQuery = (e: InputEvent) => {
    router.replace({
        name: 'wpp',
        query: {
            q: (e.target as HTMLInputElement)?.value,
        },
    });
    handleUpdateDebouncedQuery();
};

onMounted(() => {
    debouncedQuery.value = query.value;
});

const processedResults = computed(() =>
    searchResultsComponents.value?.data.map((result: SearchComponentItem) => ({
        name: capitalizeWords(result.subject),
        id: result.disciplina_id,
        turma: result.turma,
        campus: result.campus.toUpperCase(),
        link: result.wppGroupLink,
    })) || []
);

function capitalizeWords(text: string): string {
    return text
        .toLowerCase()
        .split(' ')
        .map((word) => {
            if (['ii', 'iii', 'iv'].includes(word)) return word; // manter minúsculo
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}
</script>