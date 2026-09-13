import { IconHome } from "@tabler/icons-react";
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
        "icon": <IconHome />
    },
    {
        "id": 2,
        "nombre": "Servicios del hogar",
        "value": "hogar",
        "icon": <IconHome />
    },
    {
        "id": 3,
        "nombre": "Restaurantes",
        "value": "restaurantes",
        "icon": <IconHome />
    },
    {
        "id": 4,
        "nombre": "Transporte",
        "value": "transporte",
        "icon": <IconHome />
    },
    {
        "id": 5,
        "nombre": "Salud y Bienestar",
        "value": "salud",
        "icon": <IconHome />
    },
    {
        "id": 6,
        "nombre": "Seguros",
        "value": "seguros",
        "icon": <IconHome />
    },
    {
        "id": 7,
        "nombre": "Educacion",
        "value": "educacion",
        "icon": <IconHome />
    },
    {
        "id": 8,
        "nombre": "Entretenimiento",
        "value": "entretenimiento",
        "icon": <IconHome />
    },
    {
        "id": 9,
        "nombre": "Ropa y Calzado",
        "value": "ropa",
        "icon": <IconHome />
    },
    {
        "id": 10,
        "nombre": "Cuidado Personal",
        "value": "cuidado",
        "icon": <IconHome />
    },
    {
        "id": 11,
        "nombre": "Hogar y Mantenimiento",
        "value": "mantenimiento",
        "icon": <IconHome />
    },
    {
        "id": 12,
        "nombre": "Mascotas",
        "value": "mascotas",
        "icon": <IconHome />
    },
    {
        "id": 13,
        "nombre": "Regalos y Donaciones",
        "value": "regalos",
        "icon": <IconHome />
    },
    {
        "id": 14,
        "nombre": "Finanzas y Deudas",
        "value": "finanzas",
        "icon": <IconHome />
    },
    {
        "id": 15,
        "nombre": "Ahorro e Inversion",
        "value": "ahorro",
        "icon": <IconHome />
    },
    {
        "id": 16,
        "nombre": "Viajes o vacaciones",
        "value": "vacaciones",
        "icon": <IconHome />
    },
    {
        "id": 17,
        "nombre": "Sueldo o ingreso",
        "value": "sueldo",
        "icon": <IconHome />
    }
]