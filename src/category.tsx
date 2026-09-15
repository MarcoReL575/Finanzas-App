import { IconBurger, IconBus, IconCashBanknote, IconCashPlus, IconClipboardHeart, IconDeviceGamepad, IconFirstAidKit, IconGif, IconHome, IconHomeCog, IconHomeDollar, IconPaw, IconPigMoney, IconReportMedical, IconReportMoney, IconSchool, IconShirt } from "@tabler/icons-react";
import { JSX } from "react/jsx-runtime";

type ListaGatos = {
    id: number;
    nombre: string;
    value: string
    icon: JSX.Element;
}[]

export const listaGastos: ListaGatos = [
    {
        "id": 1,
        "nombre": "Hipoteca o alquiler",
        "value": "hipoteca",
        "icon": <IconHomeDollar size={40} />
    },
    {
        "id": 2,
        "nombre": "Servicios del hogar",
        "value": "hogar",
        "icon": <IconHome size={40} />
    },
    {
        "id": 3,
        "nombre": "Restaurantes",
        "value": "restaurantes",
        "icon": <IconBurger size={40} />
    },
    {
        "id": 4,
        "nombre": "Transporte",
        "value": "transporte",
        "icon": <IconBus size={40} />
    },
    {
        "id": 5,
        "nombre": "Salud y Bienestar",
        "value": "salud",
        "icon": <IconFirstAidKit size={40} />
    },
    {
        "id": 6,
        "nombre": "Seguros",
        "value": "seguros",
        "icon": <IconReportMedical size={40} />
    },
    {
        "id": 7,
        "nombre": "Educacion",
        "value": "educacion",
        "icon": <IconSchool size={40} />
    },
    {
        "id": 8,
        "nombre": "Entretenimiento",
        "value": "entretenimiento",
        "icon": <IconDeviceGamepad size={40} />
    },
    {
        "id": 9,
        "nombre": "Ropa y Calzado",
        "value": "ropa",
        "icon": <IconShirt size={40} />
    },
    {
        "id": 10,
        "nombre": "Cuidado Personal",
        "value": "cuidado",
        "icon": <IconClipboardHeart size={40} />
    },
    {
        "id": 11,
        "nombre": "Hogar y Mantenimiento",
        "value": "mantenimiento",
        "icon": <IconHomeCog size={40} />
    },
    {
        "id": 12,
        "nombre": "Mascotas",
        "value": "mascotas",
        "icon": <IconPaw size={40} />
    },
    {
        "id": 13,
        "nombre": "Regalos y Donaciones",
        "value": "regalos",
        "icon": <IconGif size={40} />
    },
    {
        "id": 14,
        "nombre": "Finanzas y Deudas",
        "value": "finanzas",
        "icon": <IconReportMoney size={40} />
    },
    {
        "id": 15,
        "nombre": "Ahorro e Inversion",
        "value": "ahorro",
        "icon": <IconPigMoney size={40} />
    },
    {
        "id": 16,
        "nombre": "Viajes o vacaciones",
        "value": "vacaciones",
        "icon": <IconHome size={40} />
    },
    {
        "id": 17,
        "nombre": "Sueldo o ingreso",
        "value": "sueldo",
        "icon": <IconCashBanknote size={40} />
    }
]