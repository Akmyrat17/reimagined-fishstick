import { CheckStatusEnum } from '../enums';

export const GMAIL_SENDER_NAME = 'Nädip';

export const GMAIL_SUBJECTS = {
    VERIFICATION: 'Elektron poçtaňyzy tassyklaň',
    FEEDBACK_REPLY: 'Hatyňyza jogap',
    QUESTION_STATUS_CHANGE: 'Soragyňyzyň status-y üýtgedi',
    NEW_QUESTION_NOTIFICATION: 'Size gyzykly bolup biljek täze sorag',
};

export const GMAIL_STATUS_COLORS: Record<CheckStatusEnum, string> = {
    [CheckStatusEnum.NOT_CHECKED]: '#9e9e9e',
    [CheckStatusEnum.APPROVED]: '#4CAF50',
    [CheckStatusEnum.REPORTED]: '#f44336',
};

export const GMAIL_STATUS_LABELS: Record<CheckStatusEnum, string> = {
    [CheckStatusEnum.NOT_CHECKED]: 'Barlanmadyk',
    [CheckStatusEnum.APPROVED]: 'Tassyklandy',
    [CheckStatusEnum.REPORTED]: 'Ret edildi',
};

export const GMAIL_TEXTS = {
    VERIFICATION: {
        HEADING: 'Hoş Geldiňiz!',
        BODY: 'Aşaky düwmejige basyp elektron poçtaňyzy tassyklaň:',
        BUTTON: 'Elektron poçta tassyklamak',
        FALLBACK: "Eger-de düwmejik işlemese, onda aşaky giperbaglanyşyk basy barlap görüň:",
    },
    FEEDBACK_REPLY: {
        HEADING: 'Teswiriňiz üçin sag boluň!',
        BODY: "Biz siziň teswiriňizi gördük we oňa jogap bermegi makul bildik.",
        YOUR_FEEDBACK_LABEL: 'Siziň hatyňyz:',
        OUR_RESPONSE_LABEL: 'Biziň jogabymyz:',
        FOOTER: 'Eger-de bize degişli soraglaryňyz bar bolsa, onda ýüz tutmana çekinmäň!',
    },
    QUESTION_STATUS_CHANGE: {
        HEADING: 'Soragyň status-y üýtgedi',
        BODY: 'Siziň soragyňyzyň statusy üýtgedi.',
        QUESTION_LABEL: 'Sorag:',
        STATUS_FROM_LABEL: 'Geçirilen status:',
        BUTTON: 'Soragy görmek',
        FOOTER: 'Eger-de bize degişli soraglaryňyz bar bolsa, onda ýüz tutmana çekinmäň!',
    },
    NEW_QUESTION_NOTIFICATION: {
        HEADING: 'Size gyzykly bolup biljek täze sorag.',
        BODY: 'Size gyzykly bolup biljek täze sorag platformamyzda goýuldy.',
        QUESTION_LABEL: 'Sorag:',
        TAGS_LABEL: 'Degişli kategoriýasy:',
        BUTTON: 'Soragy görmek',
        FOOTER: "Eger-de bize degişli soraglaryňyz bar bolsa, onda ýüz tutmana çekinmäň!",
    },
    GENERAL_NOTIFICATION: {
        FOOTER: 'Bu hatymyza hökmany jogap bermek gerek däl. Bu duýduryjy ýa-da ş.m hatlaryň biridir! Nädip.',
    },
};