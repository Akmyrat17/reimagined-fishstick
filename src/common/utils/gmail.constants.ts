import { CheckStatusEnum } from '../enums';

export const GMAIL_SENDER_NAME = 'Nädip';

export const GMAIL_SUBJECTS = {
    VERIFICATION: 'Elektron poçtaňyzy tassyklaň',
    FEEDBACK_REPLY: 'Hatyňyza jogap',
    QUESTION_STATUS_CHANGE: 'Soragyňyzyň status-y üýtgedi',
    NEW_QUESTION_NOTIFICATION: 'Size gyzykly bolup biljek täze sorag',
    PASSWORD_RESET: 'Açar sözüňizi täzeläň',
    ANSWER_STATUS_CHANGE: 'Jogabyňyzyň status-y üýtgedi'
};

export const GMAIL_STATUS_COLORS: Record<CheckStatusEnum, string> = {
    [CheckStatusEnum.NOT_CHECKED]: '#9e9e9e',
    [CheckStatusEnum.APPROVED]: '#4CAF50',
    [CheckStatusEnum.REPORTED]: '#f44336',
    [CheckStatusEnum.DELETED]: '#000000',
};

export const GMAIL_STATUS_LABELS: Record<CheckStatusEnum, string> = {
    [CheckStatusEnum.NOT_CHECKED]: 'Barlanmadyk',
    [CheckStatusEnum.APPROVED]: 'Tassyklandy',
    [CheckStatusEnum.REPORTED]: 'Ret edildi',
    [CheckStatusEnum.DELETED]: 'Öçürildi',
};

export const GMAIL_TEXTS = {
    VERIFICATION: {
        HEADING: 'Hoş Geldiňiz!',
        BODY: 'Eger-de ulanyjy düzgünleri bilen razy bolsaňyz düwmejige basyp elektron poçtaňyzy tassyklaň:<br><br> "Nädip" platformasyny (indiden beýläk "platforma") peýdalanýan şahs (indiden beýläk "ulanyjy")   	iki tarapyň hem howpsuzlygyny üpjün etmek maksady bilen şu aşakdaky şertleri we düzgünleri berjaý etmäge borçludyr. <a href="https://nadip.info/terms-of-use">Ulanyjy düzgünlerini</a> doly okaň',
        BUTTON: 'Elektron poçta tassyklamak',
        FALLBACK: "Eger-de düwmejik işlemese, onda aşaky gipersalgylanma basyp barlap görüň:",
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
    PASSWORD_RESET: {
        HEADING: 'Açar sözi täzelemek',
        BODY: 'Açar sözüňizi täzelemek üçin aşaky düwmejige basyň. Bu gipersalgylanma 5 minutdan soň işlemez.',
        BUTTON: 'Açar sözi täzelemek',
        FALLBACK: "Eger-de düwmejik işlemese, onda aşaky gipersalgylanma basyp barlap görüň:",
        FOOTER: 'Eger-de siz bu talaby ibermedik bolsaňyz, onda bu haty görmezden geçiň — açar sözüňiz üýtgemez.',
    },
    ANSWER_STATUS_CHANGE: {
        HEADING: 'Jogabyň status-y üýtgedi',
        BODY: 'Siziň jogabyňyzyň statusy üýtgedi.',
        QUESTION_LABEL: 'Degişli sorag:',
        STATUS_FROM_LABEL: 'Geçirilen status:',
        REPORTED_REASON_LABEL: 'Ret edilmeginiň sebäbi:',  // ← add this
        FOOTER: 'Eger-de bize degişli soraglaryňyz bar bolsa, onda ýüz tutmana çekinmäň!',
    },
    GENERAL_NOTIFICATION: {
        FOOTER: 'Bu hatymyza hökmany jogap bermek gerek däl. Bu duýduryjy ýa-da ş.m hatlaryň biridir! Nädip.',
    },
};