
<template>
  <section class="d-flex flex-column elevation-1 pa-1 bg-white rounded-lg">
        <v-select
          chips
          :items="courseOptions"
          :item-title="(course) => course.curso"
          :item-value="(course) => course"
          variant="outlined"
        ></v-select>
  </section>
  <section>
    <div class="column flex mt-3 mb-4">
      <div class="meu-layout d-flex justify-content-between">
        <PlanningCard
          :value="90/90"
          title="Obrigatórias"
          color="ufabcnext-yellow"
          icon="mdi-alert-box"
        >
        </PlanningCard>
        <PlanningCard
          :value="userMaxCr"
          title="Limitadas"
          color="purple"
          icon="mdi-bullseye-arrow"
        >
        </PlanningCard>
        <PlanningCard
          :value="userMaxCr"
          title="Livres"
          color="primary"
          icon="mdi-balloon"
        >
        </PlanningCard>
        <PlanningCard
          :value="userMaxCr"
          title="Progresso total"
          color="ufabcnext-green"
          icon="mdi-school"
        >
        </PlanningCard>
      </div>
      {{ cursos }}
      <PlanningYearCard
        :materias="teste"
        :grade="cpHistoryData"
      >
      </PlanningYearCard>

      

      
    </div>
  </section>


  <FeedbackAlert v-if="isErrorEnrollments" />
  <FeedbackAlert v-if="isErrorUser" />
  <PaperCard class="mt-4">
    <div
      v-if="!!enrollmentByDateKeysSorted.length"
      class="horizontal-scroll-except-first-column"
    >
    </div>
    <div
      class="mt-5 d-flex justify-center align-center flex-column"
      v-else-if="!isPendingEnrollments"
    >
      <h2 class="mb-4">
        Parece que não encontramos os dados do seu histórico :( <br />
        É necessário instalar a
        <a :href="extensionURL" target="_blank" class="text-decoration-none"
          >extensão</a
        >
        e acessar a tela de Fichas Individuais no
        <a :href="studentRecordURL" target="_blank" class="text-decoration-none"
          >Portal do Aluno.</a
        >
      </h2>
      <img
        src="@/assets/missing_history.svg"
        width="500"
        height="400"
        alt="Histórico não encontrado"
      />
    </div>
    <CenteredLoading v-if="isPendingEnrollments" />
  </PaperCard>
















</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PlanningCard } from '@/components/PlanningCard';
import { PlanningYearCard } from '@/components/PlanningYearCard';
import { useQuery } from '@tanstack/vue-query';
import type { Enrollment } from 'types';
import { CenteredLoading } from '@/components/CenteredLoading';
import { PaperCard } from '@/components/PaperCard';
import { FeedbackAlert } from '@/components/FeedbackAlert';
import { Enrollments, Performance, Graduations } from 'services';

const { data: cursos } = useQuery({
  queryKey: ['graduation'],
  queryFn: async () => {
    try {
      const response = await Graduations.list1();
      return response.data;
    } catch (error) {
      throw new Error('Erro ao obter dados de graduação');
    }
  },
});

const courseOptions = [
  'Minha Graduação',
  'Bacharelado em Biotecnologia',
  'Bacharelado em Ciência da Computação',
  'Bacharelado em Ciências Biológicas',
  'Bacharelado em Física',
  'Bacharelado em Matemática',
  'Bacharelado em Química',
  'Bacharelado em Neurociência',
  'Engenharia Ambiental e Urbana',
  'Engenharia de Energia',
  'Engenharia de Informação',
  'Engenharia de Instrumentação, Automação e Robótica',
  'Engenharia de Materiais',
  'Engenharia Aeroespacial',
  'Engenharia Biomédica',
  'Engenharia de Gestão',
  'Bacharelado em Ciências Econômicas',
  'Bacharelado em Filosofia',
  'Bacharelado em Planejamento Territorial',
  'Bacharelado em Políticas Públicas',
  'Bacharelado em Relações Internacionais',
  'Licenciatura em Filosofia',
  'Licenciatura em Ciências Biológicas',
  'Licenciatura em Física',
  'Licenciatura em Matemática',
  'Licenciatura em Química'
];

const teste = {
  "20202": [
    {
      // "_id": "6005b8f1c4941ebd70f977eb",
      "conceito": "O",
      "creditos": 2,
      "disciplina": "Bases Conceituais da Energia",
      "quad": 2,
      // "subject": {
      //   "_id": "5bf5fbdb436c414f35a8ef82",
      //   "name": "Bases Conceituais da Energia",
      //   "search": "Bases Conceituais Da Energia",
      //   "updatedAt": "2018-11-22T00:44:12.263Z",
      //   "createdAt": "2018-11-22T00:44:12.263Z",
      //   "__v": 0,
      //   "creditos": 2
      // },
      // "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2020,
      
      // "creditos":2,
      // "disciplina":"Bases Conceituais da Energia",
      "codigo":"BIJ0207-15",
      // "ano":2020,
      // "periodo":"2",
      "categoria":"Obrigatória",
      // "conceito":"A",
      // "situacao":"Aprovado"
    },
    {
      "_id": "6005b8f1c4941ebd70f977ed",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Estrutura da Matéria",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f061",
        "name": "Estrutura da Matéria",
        "search": "Estrutura Da Materia",
        "updatedAt": "2018-11-22T00:44:12.266Z",
        "createdAt": "2018-11-22T00:44:12.266Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2020
    },
    {
      "_id": "6005b8f1c4941ebd70f977ef",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Evolução e Diversificação da Vida na Terra",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f06f",
        "name": "Evolução e Diversificação da Vida na Terra",
        "search": "Evolucao E Diversificacao Da Vida Na Terra",
        "updatedAt": "2018-11-22T00:44:12.266Z",
        "createdAt": "2018-11-22T00:44:12.266Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2020
    },
    {
      "_id": "6005b8f1c4941ebd70f977f1",
      "conceito": "A",
      "creditos": 2,
      "disciplina": "Bases Computacionais da Ciência",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef81",
        "name": "Bases Computacionais da Ciência",
        "search": "Bases Computacionais Da Ciencia",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 2
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2020
    },
    {
      "_id": "6005b8f1c4941ebd70f977f1",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Bases Matemáticas",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef81",
        "name": "Bases Computacionais da Ciência",
        "search": "Bases Computacionais Da Ciencia",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 2
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2020
    },
    {
      "_id": "6005b8f1c4941ebd70f977f1",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Base Experimental das Ciências Naturais",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef81",
        "name": "Bases Computacionais da Ciência",
        "search": "Bases Computacionais Da Ciencia",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 2
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2020
    }
  ],
  "20211": [
    {
      "_id": "609b5358244147d60c50854d",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Biodiversidade: Interações entre organismos e ambiente",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef87",
        "name": "Biodiversidade: Interações entre organismos e ambiente",
        "search": "Biodiversidade Interacoes Entre Organismos E Ambiente",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2021,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c9165",
        "name": "Gustavo Muniz Dias",
        "updatedAt": "2018-11-22T00:42:13.858Z",
        "createdAt": "2018-11-22T00:42:13.858Z",
        "__v": 0
      }
    },
    {
      "_id": "609b5358244147d60c50854f",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Natureza da Informação",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f1b8",
        "name": "Natureza da Informação",
        "search": "Natureza Da Informacao",
        "updatedAt": "2018-11-22T00:44:12.282Z",
        "createdAt": "2018-11-22T00:44:12.282Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2021,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c932e",
        "name": "Vladimir Emiliano Moreira Rocha",
        "updatedAt": "2018-11-22T00:42:13.862Z",
        "createdAt": "2018-11-22T00:42:13.862Z",
        "__v": 0
      }
    },
    {
      "_id": "609b5358244147d60c508551",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Geometria Analítica",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f0ca",
        "name": "Geometria Analítica",
        "search": "Geometria Analitica",
        "updatedAt": "2018-11-22T00:44:12.269Z",
        "createdAt": "2018-11-22T00:44:12.269Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2021,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c9268",
        "name": "Norberto Anibal Maidana",
        "updatedAt": "2018-11-22T00:42:13.860Z",
        "createdAt": "2018-11-22T00:42:13.860Z",
        "__v": 0
      }
    },
    {
      "_id": "60a95a535c16f60395486372",
      "conceito": "A",
      "creditos": 5,
      "disciplina": "Fenômenos Mecânicos",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f077",
        "name": "Fenômenos Mecânicos",
        "search": "Fenomenos Mecanicos",
        "updatedAt": "2018-11-22T00:44:12.266Z",
        "createdAt": "2018-11-22T00:44:12.266Z",
        "__v": 0,
        "creditos": 5
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2021,
      "pratica": {
        "_id": "5bf5fb65d741524f090c903e",
        "name": "Ana Melva Champi Farfan",
        "updatedAt": "2018-11-22T00:42:13.855Z",
        "createdAt": "2018-11-22T00:42:13.855Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c903e",
        "name": "Ana Melva Champi Farfan",
        "updatedAt": "2018-11-22T00:42:13.855Z",
        "createdAt": "2018-11-22T00:42:13.855Z",
        "__v": 0
      }
    },
    {
      "_id": "60a95a535c16f60395486377",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Funções de uma Variável",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef84",
        "name": "Bases Matemáticas",
        "search": "Bases Matematicas",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2021,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c9265",
        "name": "Nazar Arakelian",
        "updatedAt": "2018-11-22T00:42:13.860Z",
        "createdAt": "2018-11-22T00:42:13.860Z",
        "__v": 0
      }
    }
  ],
  "20212": [
    {
      "_id": "612fbd3711242d9652db82e5",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Fenômenos Térmicos",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f079",
        "name": "Fenômenos Térmicos",
        "search": "Fenomenos Termicos",
        "updatedAt": "2018-11-22T00:44:12.266Z",
        "createdAt": "2018-11-22T00:44:12.266Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.508Z",
      "year": 2021,
      "pratica": {
        "_id": "5dd884b46c2bed0010702c6f",
        "alias": [],
        "name": "Fagner Muruci De Paula",
        "updatedAt": "2019-11-23T01:00:36.244Z",
        "createdAt": "2019-11-23T01:00:36.244Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5dd884b46c2bed0010702c6f",
        "alias": [],
        "name": "Fagner Muruci De Paula",
        "updatedAt": "2019-11-23T01:00:36.244Z",
        "createdAt": "2019-11-23T01:00:36.244Z",
        "__v": 0
      }
    },
    {
      "_id": "612fbd3711242d9652db82e7",
      "conceito": "A",
      "creditos": 5,
      "disciplina": "Transformações Químicas",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f322",
        "name": "Transformações Químicas",
        "search": "Transformacoes Quimicas",
        "updatedAt": "2018-11-22T00:44:12.287Z",
        "createdAt": "2018-11-22T00:44:12.287Z",
        "__v": 0,
        "creditos": 5
      },
      "updatedAt": "2024-01-11T09:12:11.540Z",
      "year": 2021,
      "pratica": {
        "_id": "5bf5fb65d741524f090c9084",
        "name": "Camilo Andrea Angelucci",
        "updatedAt": "2018-11-22T00:42:13.856Z",
        "createdAt": "2018-11-22T00:42:13.856Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c9320",
        "name": "Vani Xavier De Oliveira Junior",
        "updatedAt": "2018-11-22T00:42:13.862Z",
        "createdAt": "2018-11-22T00:42:13.862Z",
        "__v": 0
      }
    },
    {
      "_id": "612fbd3711242d9652db82e9",
      "conceito": "A",
      "creditos": 5,
      "disciplina": "Processamento da Informação",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f211",
        "name": "Processamento da Informação",
        "search": "Processamento Da Informacao",
        "updatedAt": "2018-11-22T00:44:12.283Z",
        "createdAt": "2018-11-22T00:44:12.283Z",
        "__v": 0,
        "creditos": 5
      },
      "updatedAt": "2024-01-11T09:12:11.546Z",
      "year": 2021,
      "pratica": {
        "_id": "5bf5fb65d741524f090c909d",
        "name": "Celso Setsuo Kurashima",
        "updatedAt": "2018-11-22T00:42:13.856Z",
        "createdAt": "2018-11-22T00:42:13.856Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c909d",
        "name": "Celso Setsuo Kurashima",
        "updatedAt": "2018-11-22T00:42:13.856Z",
        "createdAt": "2018-11-22T00:42:13.856Z",
        "__v": 0
      }
    },
    {
      "_id": "612fbd3811242d9652db82eb",
      "conceito": "B",
      "creditos": 4,
      "disciplina": "Funções de Várias Variáveis",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f0b3",
        "name": "Funções de Uma Variável",
        "search": "Funcoes De Uma Variavel",
        "updatedAt": "2018-11-22T00:44:12.268Z",
        "createdAt": "2018-11-22T00:44:12.268Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.552Z",
      "year": 2021,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c9115",
        "name": "Fedor Pisnitchenko",
        "updatedAt": "2018-11-22T00:42:13.857Z",
        "createdAt": "2018-11-22T00:42:13.857Z",
        "__v": 0
      }
    }
  ],
  "20213": [
    {
      "_id": "61c60d777d346ecbdf7800e9",
      "conceito": "A",
      "creditos": 5,
      "disciplina": "Fenômenos Eletromagnéticos",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f076",
        "name": "Fenômenos Eletromagnéticos",
        "search": "Fenomenos Eletromagneticos",
        "updatedAt": "2018-11-22T00:44:12.266Z",
        "createdAt": "2018-11-22T00:44:12.266Z",
        "__v": 0,
        "creditos": 5
      },
      "updatedAt": "2024-01-11T09:12:11.558Z",
      "year": 2021,
      "pratica": {
        "_id": "5bf5fb65d741524f090c92a5",
        "name": "Regina Keiko Murakami",
        "updatedAt": "2018-11-22T00:42:13.861Z",
        "createdAt": "2018-11-22T00:42:13.861Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c92a5",
        "name": "Regina Keiko Murakami",
        "updatedAt": "2018-11-22T00:42:13.861Z",
        "createdAt": "2018-11-22T00:42:13.861Z",
        "__v": 0
      }
    },
    {
      "_id": "61c60d777d346ecbdf7800eb",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Comunicação e Redes",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8efc4",
        "name": "Comunicação e Redes",
        "search": "Comunicacao E Redes",
        "updatedAt": "2018-11-22T00:44:12.264Z",
        "createdAt": "2018-11-22T00:44:12.264Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.564Z",
      "year": 2021,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c9022",
        "name": "Alexandre Donizeti Alves",
        "updatedAt": "2018-11-22T00:42:13.855Z",
        "createdAt": "2018-11-22T00:42:13.855Z",
        "__v": 0
      }
    },
    {
      "_id": "61c60d777d346ecbdf7800ed",
      "conceito": "B",
      "creditos": 3,
      "disciplina": "Bases Epistemológicas da Ciência Moderna",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef83",
        "name": "Bases Epistemológicas da Ciência Moderna",
        "search": "Bases Epistemologicas Da Ciencia Moderna",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.583Z",
      "year": 2021,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c91e0",
        "name": "Luciana Zaterka",
        "updatedAt": "2018-11-22T00:42:13.859Z",
        "createdAt": "2018-11-22T00:42:13.859Z",
        "__v": 0
      }
    },
    {
      "_id": "61c60d777d346ecbdf7800ef",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Introdução às Equações Diferenciais Ordinárias",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f226",
        "name": "Programação Estruturada",
        "search": "Programacao Estruturada",
        "updatedAt": "2018-11-22T00:44:12.284Z",
        "createdAt": "2018-11-22T00:44:12.284Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.599Z",
      "year": 2021,
      "pratica": {
        "_id": "5bf5fb65d741524f090c9286",
        "name": "Paulo Henrique Pisani",
        "updatedAt": "2018-11-22T00:42:13.861Z",
        "createdAt": "2018-11-22T00:42:13.861Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c9286",
        "name": "Paulo Henrique Pisani",
        "updatedAt": "2018-11-22T00:42:13.861Z",
        "createdAt": "2018-11-22T00:42:13.861Z",
        "__v": 0
      }
    },
    {
      "_id": "61d8baf7475aff2e64d9d554",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Introdução à Probabilidade e à Estatística",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f0b6",
        "name": "Funções de Várias Variáveis",
        "search": "Funcoes De Varias Variaveis",
        "updatedAt": "2018-11-22T00:44:12.268Z",
        "createdAt": "2018-11-22T00:44:12.268Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.577Z",
      "year": 2021,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c9115",
        "name": "Fedor Pisnitchenko",
        "updatedAt": "2018-11-22T00:42:13.857Z",
        "createdAt": "2018-11-22T00:42:13.857Z",
        "__v": 0
      }
    }
  ],
  "20221": [
    {
      "_id": "62995731fb3b95f8fc0b0a5b",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Física Quântica",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f0bc",
        "name": "Física Quântica",
        "search": "Fisica Quantica",
        "updatedAt": "2018-11-22T00:44:12.268Z",
        "createdAt": "2018-11-22T00:44:12.268Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.606Z",
      "year": 2022,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c920b",
        "name": "Marcelo Oliveira Da Costa Pires",
        "updatedAt": "2018-11-22T00:42:13.860Z",
        "createdAt": "2018-11-22T00:42:13.860Z",
        "__v": 0
      }
    },
    {
      "_id": "62995731fb3b95f8fc0b0a5d",
      "conceito": "A",
      "creditos": 5,
      "disciplina": "Bioquímica: Estrutura, Propriedade e Funções de Biomoléculas",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef9b",
        "name": "Bioquímica: Estrutura, Propriedade e Funções de Biomoléculas",
        "search": "Bioquimica Estrutura Propriedade E Funcoes De Biomoleculas",
        "updatedAt": "2018-11-22T00:44:12.264Z",
        "createdAt": "2018-11-22T00:44:12.264Z",
        "__v": 0,
        "creditos": 5
      },
      "updatedAt": "2024-01-11T09:12:11.614Z",
      "year": 2022,
      "pratica": {
        "_id": "5bf5fb65d741524f090c9084",
        "name": "Camilo Andrea Angelucci",
        "updatedAt": "2018-11-22T00:42:13.856Z",
        "createdAt": "2018-11-22T00:42:13.856Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c91e2",
        "name": "Luciano Puzer",
        "updatedAt": "2018-11-22T00:42:13.859Z",
        "createdAt": "2018-11-22T00:42:13.859Z",
        "__v": 0
      }
    },
    {
      "_id": "62995731fb3b95f8fc0b0a5f",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Estrutura e Dinâmica Social",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f141",
        "name": "Introdução à Probabilidade e à Estatística",
        "search": "Introducao A Probabilidade EA Estatistica",
        "updatedAt": "2018-11-22T00:44:12.281Z",
        "createdAt": "2018-11-22T00:44:12.281Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.632Z",
      "year": 2022,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c908d",
        "name": "Carlos Da Silva Dos Santos",
        "updatedAt": "2018-11-22T00:42:13.856Z",
        "createdAt": "2018-11-22T00:42:13.856Z",
        "__v": 0
      }
    },
    {
      "_id": "62995731fb3b95f8fc0b0a61",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Lógica Básica",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f29c",
        "name": "Segurança de Redes",
        "search": "Seguranca De Redes",
        "updatedAt": "2018-11-22T00:44:12.285Z",
        "createdAt": "2018-11-22T00:44:12.285Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.637Z",
      "year": 2022,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c918e",
        "name": "Joao Henrique Kleinschmidt",
        "updatedAt": "2018-11-22T00:42:13.858Z",
        "createdAt": "2018-11-22T00:42:13.858Z",
        "__v": 0
      }
    },
    {
      "_id": "62995731fb3b95f8fc0b0a63",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Programação Estruturada",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef4e",
        "name": "Algoritmos e Estruturas de Dados I",
        "search": "Algoritmos E Estruturas De Dados I",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.642Z",
      "year": 2022
    }
  ],
  "20222": [
    {
      "_id": "63233a397a974e2b06242c39",
      "conceito": "A",
      "creditos": 3,
      "disciplina": "Interações Atômicas e Moleculares",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f11d",
        "name": "Interações Atômicas e Moleculares",
        "search": "Interacoes Atomicas E Moleculares",
        "updatedAt": "2018-11-22T00:44:12.280Z",
        "createdAt": "2018-11-22T00:44:12.280Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.648Z",
      "year": 2022,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c916f",
        "name": "Hueder Paulo Moises De Oliveira",
        "updatedAt": "2018-11-22T00:42:13.858Z",
        "createdAt": "2018-11-22T00:42:13.858Z",
        "__v": 0
      }
    },
    {
      "_id": "63233a397a974e2b06242c3b",
      "conceito": "B",
      "creditos": 3,
      "disciplina": "Ciência Tecnologia e Sociedade",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f146",
        "name": "Introdução às Equações Diferenciais Ordinárias",
        "search": "Introducao As Equacoes Diferenciais Ordinarias",
        "updatedAt": "2018-11-22T00:44:12.281Z",
        "createdAt": "2018-11-22T00:44:12.281Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.654Z",
      "year": 2022,
      "pratica": null,
      "teoria": {
        "_id": "62c415ff8059c2001800d698",
        "alias": [],
        "name": "Giliard Souza Dos Anjos",
        "updatedAt": "2022-07-05T10:44:15.798Z",
        "createdAt": "2022-07-05T10:44:15.798Z",
        "__v": 0
      }
    },
    {
      "_id": "63233a397a974e2b06242c3d",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Circuitos Digitais",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef7e",
        "name": "Base Experimental das Ciências Naturais",
        "search": "Base Experimental Das Ciencias Naturais",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.661Z",
      "year": 2022,
      "pratica": {
        "_id": "5bf5fb65d741524f090c91cd",
        "name": "Leonardo Jose Steil",
        "updatedAt": "2018-11-22T00:42:13.859Z",
        "createdAt": "2018-11-22T00:42:13.859Z",
        "__v": 0
      },
      "teoria": null
    },
    {
      "_id": "63233a397a974e2b06242c3f",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Algoritmos e Estruturas de Dados I",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f063",
        "name": "Estrutura e Dinâmica Social",
        "search": "Estrutura E Dinamica Social",
        "updatedAt": "2018-11-22T00:44:12.266Z",
        "createdAt": "2018-11-22T00:44:12.266Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.668Z",
      "year": 2022,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c906c",
        "name": "Antonio Marcos Roseira",
        "updatedAt": "2018-11-22T00:42:13.856Z",
        "createdAt": "2018-11-22T00:42:13.856Z",
        "__v": 0
      }
    },
    {
      "_id": "63233a397a974e2b06242c3f",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Matemática Discreta",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f063",
        "name": "Estrutura e Dinâmica Social",
        "search": "Estrutura E Dinamica Social",
        "updatedAt": "2018-11-22T00:44:12.266Z",
        "createdAt": "2018-11-22T00:44:12.266Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.668Z",
      "year": 2022,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c906c",
        "name": "Antonio Marcos Roseira",
        "updatedAt": "2018-11-22T00:42:13.856Z",
        "createdAt": "2018-11-22T00:42:13.856Z",
        "__v": 0
      }
    }
  ],
  "20223": [
    {
      "_id": "63ab605118d54d50c2fb6cc0",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Sistemas Digitais",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8efb5",
        "name": "Ciência, Tecnologia e Sociedade",
        "search": "Ciencia Tecnologia E Sociedade",
        "updatedAt": "2018-11-22T00:44:12.264Z",
        "createdAt": "2018-11-22T00:44:12.264Z",
        "__v": 0,
        "creditos": 3
      },
      "updatedAt": "2024-01-11T09:12:11.690Z",
      "year": 2022
    },
    {
      "_id": "63ab605118d54d50c2fb6cc2",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Análise de Algoritmos",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f198",
        "name": "Modelagem e Controle",
        "search": "Modelagem E Controle",
        "updatedAt": "2018-11-22T00:44:12.282Z",
        "createdAt": "2018-11-22T00:44:12.282Z",
        "__v": 0,
        "creditos": 2
      },
      "updatedAt": "2024-01-11T09:12:11.696Z",
      "year": 2022
    },
    {
      "_id": "63ab605118d54d50c2fb6cc4",
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Programação Orientada a Objetos",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f204",
        "name": "Princípios de Administração",
        "search": "Principios De Administracao",
        "updatedAt": "2018-11-22T00:44:12.283Z",
        "createdAt": "2018-11-22T00:44:12.283Z",
        "__v": 0,
        "creditos": 2
      },
      "updatedAt": "2024-01-11T09:12:11.701Z",
      "year": 2022
    },
    {
      "_id": "63ab605118d54d50c2fb6cc6",
      "conceito": "B",
      "creditos": 6,
      "disciplina": "Álgebra Linear",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef4f",
        "name": "Algoritmos e Estruturas de Dados II",
        "search": "Algoritmos E Estruturas De Dados Ii",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.707Z",
      "year": 2022
    },
    {
      "_id": "63b323b070ee9c4cb5c79f1f",
      "conceito": "A",
      "creditos": 2,
      "disciplina": "Computadores, Ética e Sociedade",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f15f",
        "name": "Lógica Básica",
        "search": "Logica Basica",
        "updatedAt": "2018-11-22T00:44:12.281Z",
        "createdAt": "2018-11-22T00:44:12.281Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.728Z",
      "year": 2022,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c922e",
        "name": "Maria Das Gracas Bruno Marietto",
        "updatedAt": "2018-11-22T00:42:13.860Z",
        "createdAt": "2018-11-22T00:42:13.860Z",
        "__v": 0
      }
    }
  ],
  "20231": [
    {
      "_id": "6473fd5af02a9ad401c3651b",
      "comments": [],
      "conceito": "B",
      "creditos": 4,
      "disciplina": "Arquitetura de Computadores",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8efad",
        "name": "Circuitos Digitais",
        "search": "Circuitos Digitais",
        "updatedAt": "2018-11-22T00:44:12.264Z",
        "createdAt": "2018-11-22T00:44:12.264Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.734Z",
      "year": 2023,
      "pratica": {
        "_id": "5bf5fb65d741524f090c919e",
        "name": "Jose Artur Quilici Gonzalez",
        "updatedAt": "2018-11-22T00:42:13.858Z",
        "createdAt": "2018-11-22T00:42:13.858Z",
        "__v": 0
      },
      "teoria": {
        "_id": "63726e217b18ad001887ef2c",
        "alias": [],
        "name": "Hugo Puertas De Araujo",
        "updatedAt": "2022-11-14T16:34:41.938Z",
        "createdAt": "2022-11-14T16:34:41.938Z",
        "__v": 0
      }
    },
    {
      "_id": "6473fd5af02a9ad401c3651d",
      "comments": [],
      "conceito": "D",
      "creditos": 4,
      "disciplina": "Algoritmos e Estruturas de Dados II",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f15c",
        "name": "Linguagens Formais e Automata",
        "search": "Linguagens Formais E Automata",
        "updatedAt": "2018-11-22T00:44:12.281Z",
        "createdAt": "2018-11-22T00:44:12.281Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.740Z",
      "year": 2023,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c9022",
        "name": "Alexandre Donizeti Alves",
        "updatedAt": "2018-11-22T00:42:13.855Z",
        "createdAt": "2018-11-22T00:42:13.855Z",
        "__v": 0
      }
    },
    {
      "_id": "6473fd5af02a9ad401c36522",
      "comments": [],
      "conceito": "C",
      "creditos": 4,
      "disciplina": "Teoria dos Grafos",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f27f",
        "name": "Redes de Computadores",
        "search": "Redes De Computadores",
        "updatedAt": "2018-11-22T00:44:12.285Z",
        "createdAt": "2018-11-22T00:44:12.285Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.746Z",
      "year": 2023,
      "pratica": {
        "_id": "63726e507b18ad001887f0a9",
        "alias": [],
        "name": "Rodrigo Augusto Cardoso Da Silva",
        "updatedAt": "2022-11-14T16:35:28.363Z",
        "createdAt": "2022-11-14T16:35:28.363Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c9166",
        "name": "Gustavo Sousa Pavani",
        "updatedAt": "2018-11-22T00:42:13.858Z",
        "createdAt": "2018-11-22T00:42:13.858Z",
        "__v": 0
      }
    },
    {
      "_id": "6473fd5af02a9ad401c36524",
      "comments": [],
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Banco de Dados",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f04f",
        "name": "Engenharia de Software",
        "search": "Engenharia De Software",
        "updatedAt": "2018-11-22T00:44:12.266Z",
        "createdAt": "2018-11-22T00:44:12.266Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.752Z",
      "year": 2023,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c91b1",
        "name": "Juliana Cristina Braga",
        "updatedAt": "2018-11-22T00:42:13.859Z",
        "createdAt": "2018-11-22T00:42:13.859Z",
        "__v": 0
      }
    },
    {
      "_id": "6473fd5af02a9ad401c36524",
      "comments": [],
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Inteligência Artificial",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f04f",
        "name": "Engenharia de Software",
        "search": "Engenharia De Software",
        "updatedAt": "2018-11-22T00:44:12.266Z",
        "createdAt": "2018-11-22T00:44:12.266Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.752Z",
      "year": 2023,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c91b1",
        "name": "Juliana Cristina Braga",
        "updatedAt": "2018-11-22T00:42:13.859Z",
        "createdAt": "2018-11-22T00:42:13.859Z",
        "__v": 0
      }
    }
  ],
  "20232": [
    {
      "_id": "6502a405216580ff36a9e745",
      "comments": [],
      "conceito": "B",
      "creditos": 4,
      "disciplina": "Redes de Computadores",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8f0a2",
        "name": "Fundamentos de Desenho Técnico",
        "search": "Fundamentos De Desenho Tecnico",
        "updatedAt": "2018-11-22T00:44:12.268Z",
        "createdAt": "2018-11-22T00:44:12.268Z",
        "__v": 0,
        "creditos": 2
      },
      "updatedAt": "2024-01-11T09:12:11.757Z",
      "year": 2023,
      "pratica": null,
      "teoria": {
        "_id": "62c4169f8059c2001800da78",
        "alias": [],
        "name": "Fernanda Borges Monteiro Alves",
        "updatedAt": "2022-07-05T10:46:55.204Z",
        "createdAt": "2022-07-05T10:46:55.204Z",
        "__v": 0
      }
    },
    {
      "_id": "6502a405216580ff36a9e747",
      "comments": [],
      "conceito": "C",
      "creditos": 4,
      "disciplina": "Sistemas Operacionais",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef5e",
        "name": "Análise de Algoritmos",
        "search": "Analise De Algoritmos",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.765Z",
      "year": 2023,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c9086",
        "name": "Carla Negri Lintzmayer",
        "updatedAt": "2018-11-22T00:42:13.856Z",
        "createdAt": "2018-11-22T00:42:13.856Z",
        "__v": 0
      }
    },
    {
      "_id": "6502a405216580ff36a9e749",
      "comments": [],
      "conceito": "B",
      "creditos": 4,
      "disciplina": "Linguagens Formais e Automata",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8efbd",
        "name": "Compiladores",
        "search": "Compiladores",
        "updatedAt": "2018-11-22T00:44:12.264Z",
        "createdAt": "2018-11-22T00:44:12.264Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.771Z",
      "year": 2023,
      "pratica": {
        "_id": "5bf5fb65d741524f090c913a",
        "name": "Francisco Isidro Massetto",
        "updatedAt": "2018-11-22T00:42:13.858Z",
        "createdAt": "2018-11-22T00:42:13.858Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c913a",
        "name": "Francisco Isidro Massetto",
        "updatedAt": "2018-11-22T00:42:13.858Z",
        "createdAt": "2018-11-22T00:42:13.858Z",
        "__v": 0
      }
    },
    {
      "_id": "6502a406216580ff36a9e76e",
      "comments": [],
      "conceito": "A",
      "creditos": 4,
      "disciplina": "Engenharia de Software",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8efbf",
        "name": "Computadores, Ética e Sociedade",
        "search": "Computadores Etica E Sociedade",
        "updatedAt": "2018-11-22T00:44:12.264Z",
        "createdAt": "2018-11-22T00:44:12.264Z",
        "__v": 0,
        "creditos": 2
      },
      "updatedAt": "2024-01-11T09:12:11.776Z",
      "year": 2023,
      "pratica": null,
      "teoria": {
        "_id": "5bf5fb65d741524f090c9186",
        "name": "Jeronimo Cordoni Pellegrini",
        "updatedAt": "2018-11-22T00:42:13.858Z",
        "createdAt": "2018-11-22T00:42:13.858Z",
        "__v": 0
      }
    },
    {
      "_id": "6502a406216580ff36a9e770",
      "comments": [],
      "conceito": "B",
      "creditos": 2,
      "disciplina": "Projeto Dirigido",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f228",
        "name": "Programação Orientada a Objetos",
        "search": "Programacao Orientada A Objetos",
        "updatedAt": "2018-11-22T00:44:12.284Z",
        "createdAt": "2018-11-22T00:44:12.284Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.813Z",
      "year": 2023,
      "pratica": {
        "_id": "5bf5fb65d741524f090c9286",
        "name": "Paulo Henrique Pisani",
        "updatedAt": "2018-11-22T00:42:13.861Z",
        "createdAt": "2018-11-22T00:42:13.861Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c9286",
        "name": "Paulo Henrique Pisani",
        "updatedAt": "2018-11-22T00:42:13.861Z",
        "createdAt": "2018-11-22T00:42:13.861Z",
        "__v": 0
      }
    },
    {
      "_id": "6502a406216580ff36a9e770",
      "comments": [],
      "conceito": "B",
      "creditos": 4,
      "disciplina": "Livre",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f228",
        "name": "Programação Orientada a Objetos",
        "search": "Programacao Orientada A Objetos",
        "updatedAt": "2018-11-22T00:44:12.284Z",
        "createdAt": "2018-11-22T00:44:12.284Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.813Z",
      "year": 2023,
      "pratica": {
        "_id": "5bf5fb65d741524f090c9286",
        "name": "Paulo Henrique Pisani",
        "updatedAt": "2018-11-22T00:42:13.861Z",
        "createdAt": "2018-11-22T00:42:13.861Z",
        "__v": 0
      },
      "teoria": {
        "_id": "5bf5fb65d741524f090c9286",
        "name": "Paulo Henrique Pisani",
        "updatedAt": "2018-11-22T00:42:13.861Z",
        "createdAt": "2018-11-22T00:42:13.861Z",
        "__v": 0
      }
    }
  ],
  "20233": [
    {
      "_id": "659f2c9691a8824fda6ef0e2",
      "comments": [],
      "conceito": "A",
      "creditos": 8,
      "disciplina": "Projeto de Graduação em Computação I",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef6e",
        "name": "Arquitetura de Computadores",
        "search": "Arquitetura De Computadores",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.819Z",
      "year": 2023
    },
    {
      "_id": "659f2c9691a8824fda6ef0e4",
      "comments": [],
      "conceito": "C",
      "creditos": 4,
      "disciplina": "Sistemas Distribuidos",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f119",
        "name": "Inteligência Artificial",
        "search": "Inteligencia Artificial",
        "updatedAt": "2018-11-22T00:44:12.280Z",
        "createdAt": "2018-11-22T00:44:12.280Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.825Z",
      "year": 2023
    },
    {
      "_id": "659f2c9691a8824fda6ef0e6",
      "comments": [],
      "conceito": "D",
      "creditos": 4,
      "disciplina": "Compiladores",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f2fd",
        "name": "Teoria dos Grafos",
        "search": "Teoria Dos Grafos",
        "updatedAt": "2018-11-22T00:44:12.287Z",
        "createdAt": "2018-11-22T00:44:12.287Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.831Z",
      "year": 2023
    },
    {
      "_id": "659f2c9691a8824fda6ef0e8",
      "comments": [],
      "conceito": "B",
      "creditos": 4,
      "disciplina": "Paradigmas de Programação",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef7c",
        "name": "Banco de Dados",
        "search": "Banco De Dados",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.846Z",
      "year": 2023
    },
    {
      "_id": "659f2c9691a8824fda6ef0ea",
      "comments": [],
      "conceito": "B",
      "creditos": 8,
      "disciplina": "Opção Limitada",
      "quad": 3,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f216",
        "name": "Processamento de Linguagem Natural",
        "search": "Processamento De Linguagem Natural",
        "updatedAt": "2018-11-22T00:44:12.283Z",
        "createdAt": "2018-11-22T00:44:12.283Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.856Z",
      "year": 2023
    }
  ],
  "20241": [
    {
      "_id": "659f2c9691a8824fda6ef0e2",
      "comments": [],
      "conceito": "A",
      "creditos": 8,
      "disciplina": "Projeto de Graduação em Computação II",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef6e",
        "name": "Arquitetura de Computadores",
        "search": "Arquitetura De Computadores",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.819Z",
      "year": 2024
    },
    {
      "_id": "659f2c9691a8824fda6ef0e4",
      "comments": [],
      "conceito": "C",
      "creditos": 4,
      "disciplina": "Computação Gráfica",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f119",
        "name": "Inteligência Artificial",
        "search": "Inteligencia Artificial",
        "updatedAt": "2018-11-22T00:44:12.280Z",
        "createdAt": "2018-11-22T00:44:12.280Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.825Z",
      "year": 2024
    },
    {
      "_id": "659f2c9691a8824fda6ef0e6",
      "comments": [],
      "conceito": "D",
      "creditos": 4,
      "disciplina": "Programação Matemática",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f2fd",
        "name": "Teoria dos Grafos",
        "search": "Teoria Dos Grafos",
        "updatedAt": "2018-11-22T00:44:12.287Z",
        "createdAt": "2018-11-22T00:44:12.287Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.831Z",
      "year": 2024
    },
    {
      "_id": "659f2c9691a8824fda6ef0e8",
      "comments": [],
      "conceito": "B",
      "creditos": 12,
      "disciplina": "Opção Limitada",
      "quad": 1,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef7c",
        "name": "Banco de Dados",
        "search": "Banco De Dados",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.846Z",
      "year": 2024
    }
  ],
  "20242": [
    {
      "_id": "659f2c9691a8824fda6ef0e2",
      "comments": [],
      "conceito": "A",
      "creditos": 8,
      "disciplina": "Projeto de Graduação em Computação III",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef6e",
        "name": "Arquitetura de Computadores",
        "search": "Arquitetura De Computadores",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.819Z",
      "year": 2024
    },
    {
      "_id": "659f2c9691a8824fda6ef0e4",
      "comments": [],
      "conceito": "C",
      "creditos": 4,
      "disciplina": "Segurança de Dados",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f119",
        "name": "Inteligência Artificial",
        "search": "Inteligencia Artificial",
        "updatedAt": "2018-11-22T00:44:12.280Z",
        "createdAt": "2018-11-22T00:44:12.280Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.825Z",
      "year": 2024
    },
    {
      "_id": "659f2c9691a8824fda6ef0e6",
      "comments": [],
      "conceito": "D",
      "creditos": 8,
      "disciplina": "Livre",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdc436c414f35a8f2fd",
        "name": "Teoria dos Grafos",
        "search": "Teoria Dos Grafos",
        "updatedAt": "2018-11-22T00:44:12.287Z",
        "createdAt": "2018-11-22T00:44:12.287Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.831Z",
      "year": 2024
    },
    {
      "_id": "659f2c9691a8824fda6ef0e8",
      "comments": [],
      "conceito": "B",
      "creditos": 10,
      "disciplina": "Opção Limitada",
      "quad": 2,
      "subject": {
        "_id": "5bf5fbdb436c414f35a8ef7c",
        "name": "Banco de Dados",
        "search": "Banco De Dados",
        "updatedAt": "2018-11-22T00:44:12.263Z",
        "createdAt": "2018-11-22T00:44:12.263Z",
        "__v": 0,
        "creditos": 4
      },
      "updatedAt": "2024-01-11T09:12:11.846Z",
      "year": 2024
    }
  ]
}

const {
  data: enrollments,
  isPending: isPendingEnrollments,
  isError: isErrorEnrollments,
} = useQuery({
  queryKey: ['enrollments', 'list'],
  queryFn: Enrollments.list,
  select: (response) => response.data,
});

const enrollmentByDate = computed(() => {
  const enrollmentCopy = enrollments.value?.slice();
  return enrollmentCopy?.reduce(
    (acc, enroll) => {
      const date = enroll.quad + enroll.year * 10;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(enroll);
      return acc;
    },
    {} as Record<string, Enrollment[]>,
  );
});

const enrollmentByDateKeysSorted = computed(() =>
  Object.keys(enrollmentByDate.value || {}).sort(),
);

// DADOS SOBRE CR
const {
  data: crHistoryData,
  // isLoading: isLoadingCrHistory,
} = useQuery({
  queryKey: ['crHistory'],
  queryFn: Performance.getCrHistory,
  select: (response) => response.data,
});
const userMaxCr = computed(() => {
  const crAcumulados = crHistoryData.value?.map((quad) => quad.cr_acumulado);
  if (crAcumulados) {
    return Math.max(...crAcumulados).toFixed(2);
  } else {
    return 'undefined';
  }
});


// const cpHistoryData = ref([]);

const { data: cpHistoryData } = useQuery({
  queryKey: ['historiesGraduations'],
  queryFn: Performance.getHistoriesGraduations,
  select: (response) => {
    const disciplinas = response.data.docs.map((curso) => curso.disciplinas);
    return disciplinas[0];
  }
});



// DADOS SOBRE CP
// const currentCpHistory = ref<CourseInformation>();
// const {
//   data: cpHistoryData,
//   // isLoading: isLoadingCrHistory,
// } = useQuery({
//   queryKey: ['cpHistory'],
//   queryFn: Performance.getHistoriesGraduations,
//   select: (response) => {
//     currentCpHistory.value = response.data.docs[0]; // updating v-select
//     return response.data.docs;
//   },
// });
</script>

    
<style scoped>
.meu-layout {
  display: flex;
  /* justify-content: space-between; */
}
.chip-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>