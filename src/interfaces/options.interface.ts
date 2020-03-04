export interface Choices {
    title: string;
    value: any;
    disable?: boolean;
}

export type SelectOptionType = 'select' | 'multiselect'

export type InputOptionType = 'text' | 'password' | 'number' | 'invisible'

export type ConfirmOptionType = 'confirm' | 'toggle'
