import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const OnboardingTour = ({ run, onFinish }) => {
    const [steps] = useState([
        {
            content: (
                <div style={{ textAlign: 'center' }}>
                    <h3>Bem-vindo ao Saldo+! 🚀</h3>
                    <p>Vamos fazer um tour rápido para você dominar suas finanças.</p>
                </div>
            ),
            locale: { skip: 'Pular' },
            placement: 'center',
            target: 'body',
        },
        {
            content: 'Aqui você adiciona suas receitas e despesas. Clique para expandir!',
            target: '#transaction-form-toggle',
            placement: 'bottom',
        },
        {
            content: 'Acompanhe seu saldo atual e o resumo do mês aqui.',
            target: '#balance-card',
            placement: 'bottom',
        },
        {
            content: 'Navegue entre os meses para ver seu histórico ou planejar o futuro.',
            target: '#month-filter',
            placement: 'bottom',
        },
        {
            content: (
                <div style={{ textAlign: 'center' }}>
                    <h3>Tudo pronto! 🎉</h3>
                    <p>Agora é com você. Comece adicionando sua primeira transação.</p>
                </div>
            ),
            placement: 'center',
            target: 'body',
        }
    ]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            if (onFinish) onFinish();
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showProgress
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    arrowColor: '#2d2d2d',
                    backgroundColor: '#2d2d2d',
                    overlayColor: 'rgba(0, 0, 0, 0.8)',
                    primaryColor: '#bb86fc',
                    textColor: '#fff',
                    zIndex: 10000,
                },
                buttonNext: {
                    backgroundColor: '#bb86fc',
                    color: '#000',
                    fontWeight: 'bold',
                },
                buttonBack: {
                    color: '#fff',
                }
            }}
            locale={{
                back: 'Voltar',
                close: 'Fechar',
                last: 'Concluir',
                next: 'Próximo',
                skip: 'Pular',
            }}
        />
    );
};

export default OnboardingTour;
