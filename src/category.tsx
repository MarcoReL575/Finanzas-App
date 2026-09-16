import { IconBurger, IconBus, IconCashBanknote, IconCashPlus, IconClipboardHeart, IconCoin, IconDeviceGamepad, IconFirstAidKit, IconGif, IconHome, IconHomeCog, IconHomeDollar, IconPaw, IconPigMoney, IconPlane, IconReportMedical, IconReportMoney, IconSchool, IconShirt } from "@tabler/icons-react";
import { JSX } from "react/jsx-runtime";

type ListaGatos = {
    id: number;
    label: string;
    value: string
    icon: React.ReactNode;
}[]

export const listaGastos: ListaGatos = [
    {
        "id": 0,
        "label": "Todos",
        "value": "all",
        "icon": <IconCoin size={60} />
    },
    {
        "id": 1,
        "label": "Hipoteca o alquiler",
        "value": "hipoteca",
        "icon": <IconHomeDollar size={60} />
    },
    {
        "id": 2,
        "label": "Servicios del hogar",
        "value": "hogar",
        "icon": <IconHome size={40} />
    },
    {
        "id": 3,
        "label": "Restaurantes",
        "value": "restaurantes",
        "icon": <IconBurger size={40} />
    },
    {
        "id": 4,
        "label": "Transporte",
        "value": "transporte",
        "icon": <IconBus size={40} />
    },
    {
        "id": 5,
        "label": "Salud y Bienestar",
        "value": "salud",
        "icon": <IconFirstAidKit size={40} />
    },
    {
        "id": 6,
        "label": "Seguros",
        "value": "seguros",
        "icon": <IconReportMedical size={40} />
    },
    {
        "id": 7,
        "label": "Educacion",
        "value": "educacion",
        "icon": <IconSchool size={40} />
    },
    {
        "id": 8,
        "label": "Entretenimiento",
        "value": "entretenimiento",
        "icon": <IconDeviceGamepad size={40} />
    },
    {
        "id": 9,
        "label": "Ropa y Calzado",
        "value": "ropa",
        "icon": <IconShirt size={40} />
    },
    {
        "id": 10,
        "label": "Cuidado Personal",
        "value": "cuidado",
        "icon": <IconClipboardHeart size={40} />
    },
    {
        "id": 11,
        "label": "Hogar y Mantenimiento",
        "value": "mantenimiento",
        "icon": <IconHomeCog size={40} />
    },
    {
        "id": 12,
        "label": "Mascotas",
        "value": "mascotas",
        "icon": <IconPaw size={40} />
    },
    {
        "id": 13,
        "label": "Regalos y Donaciones",
        "value": "regalos",
        "icon": <IconGif size={40} />
    },
    {
        "id": 14,
        "label": "Finanzas y Deudas",
        "value": "finanzas",
        "icon": <IconReportMoney size={40} />
    },
    {
        "id": 15,
        "label": "Ahorro e Inversion",
        "value": "ahorro",
        "icon": <IconPigMoney size={40} />
    },
    {
        "id": 16,
        "label": "Viajes o vacaciones",
        "value": "vacaciones",
        "icon": <IconPlane size={40} />
    },
    {
        "id": 17,
        "label": "Sueldo o ingreso",
        "value": "sueldo",
        "icon": <IconCashBanknote size={40} />
    }
]