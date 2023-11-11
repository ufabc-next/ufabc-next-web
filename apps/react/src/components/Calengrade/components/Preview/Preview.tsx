import React, { useEffect, useState } from 'react';

import calendarImage from '../../assets/calendar_done.svg';
import loadingImage from '../../assets/loading.svg';
import { useCalengradeContext } from '../../context/CalengradeContext';
import { handleCalendar } from '../../utils/calendar';

export const Preview = () => {
  const { calengrade, setCalengrade, setActiveScreen } = useCalengradeContext();

  const {
    classes,
    quarter: { startDate, endDate },
    calendar,
  } = calengrade;

  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!timer) {
      interval = setInterval(() => setStep((s) => s + 1), 2500);
      setTimer(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (classes.length <= 0 || !startDate || !endDate) {
      setActiveScreen('summary');
    }

    switch (step) {
      case 0: // Gerar
        const newCalendar = calendar
          ? calendar
          : handleCalendar({
              classes,
              startDate,
              endDate,
            });

        setCalengrade({
          ...calengrade,
          calendar: newCalendar,
        });
        break;

      case 1: // Download
        try {
          const {
            calendar,
            quarter: { title },
          } = calengrade;

          if (calendar && typeof calendar === 'string') {
            const blob = new Blob([calendar], { type: 'text/calendar' });

            const downloadURL = URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');

            downloadLink.href = downloadURL;
            downloadLink.download = `Meu Calengrade - ${title}.ics`;
            downloadLink.href = downloadURL;
            downloadLink.click();

            URL.revokeObjectURL(downloadURL);
          } else {
            if (timer) clearInterval(timer);
            alert('Não foi possível baixar seu Calengrade!');
          }
        } catch (e) {
          console.log('ERROR', e);
          alert('Não foi possível baixar seu Calengrade!');
          if (timer) clearInterval(timer);
          setActiveScreen('summary');
        }
        break;

      default:
        if (timer) clearInterval(timer);
        break;
    }
  }, [step]); // eslint-disable-line

  return step <= 1 ? (
    <>
      <div>
        <h1>{step === 0 ? 'Gerando o seu calengrade' : 'Fazendo download'}</h1>
        <h2>...</h2>
      </div>

      <img src={loadingImage} alt="Calendário acadêmico" />

      <div>
        <h1>Você sabia?</h1>
        <h3>
          O Calengrade foi desenvolvido em 2020 por Marcelo Farias, um ex aluno
          da UFABC.
        </h3>
      </div>
    </>
  ) : (
    <>
      <div>
        <h1>Seu Calengrade está pronto!</h1>
        <h2>
          Abra o arquivo com seu aplicativo de calendário favorito e aproveite
          :)
        </h2>
      </div>
      <div>
        <img src={calendarImage} alt="Calendário" />
      </div>
      <div>
        <button
          onClick={() => {
            setActiveScreen('summary');
            setCalengrade({
              classes: [],
              quarter: {},
              summary: '',
            });
          }}
        >
          Fazer novo Calengrade
        </button>
      </div>
    </>
  );
};
