export type SledaiItemKey =
  | "seizure" | "psychosis" | "organic_brain" | "visual_disturbance"
  | "cranial_nerve" | "lupus_headache" | "cva" | "vasculitis"
  | "arthritis" | "myositis" | "urinary_casts" | "hematuria"
  | "proteinuria" | "pyuria"
  | "rash" | "alopecia" | "mucosal_ulcers"
  | "pleuritis" | "pericarditis"
  | "low_complement" | "dna_binding"
  | "fever" | "thrombocytopenia" | "leukopenia";

export interface SledaiItem {
  key: SledaiItemKey;
  label: string;
  description: string;
  weight: number;
  group: string;
}

export interface SledaiGroup {
  id: string;
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
  items: SledaiItem[];
}

export const SLEDAI_GROUPS: SledaiGroup[] = [
  {
    id: "neuropsychiatric",
    label: "Neuropsiquiátrico",
    color: "text-purple-700",
    borderColor: "border-purple-500",
    bgColor: "bg-purple-50",
    items: [
      {
        key: "seizure",
        label: "Convulsión",
        description: "Reciente, sin causa metabólica, infecciosa o farmacológica.",
        weight: 8,
        group: "neuropsychiatric",
      },
      {
        key: "psychosis",
        label: "Psicosis",
        description: "Alteración grave de la percepción de la realidad: alucinaciones, incoherencia, pensamiento desorganizado.",
        weight: 8,
        group: "neuropsychiatric",
      },
      {
        key: "organic_brain",
        label: "Síndrome orgánico cerebral",
        description: "Función mental alterada con desorientación, memoria deteriorada u otra función cognitiva reducida, de inicio agudo y fluctuante.",
        weight: 8,
        group: "neuropsychiatric",
      },
      {
        key: "visual_disturbance",
        label: "Trastorno visual",
        description: "Cambios retinianos del LES: cuerpos citoides, hemorragias retinianas, exudados serosos o hemorragias coroideas, neuritis óptica.",
        weight: 8,
        group: "neuropsychiatric",
      },
      {
        key: "cranial_nerve",
        label: "Trastorno de nervio craneal",
        description: "Nueva neuropatía sensitiva o motora de nervio craneal.",
        weight: 8,
        group: "neuropsychiatric",
      },
      {
        key: "lupus_headache",
        label: "Cefalea lúpica",
        description: "Cefalea intensa y persistente; puede ser migrañosa pero no responde a analgésicos narcóticos.",
        weight: 8,
        group: "neuropsychiatric",
      },
      {
        key: "cva",
        label: "ACV",
        description: "Nuevo accidente cerebrovascular. Excluir arteriosclerosis u otras causas no lúpicas.",
        weight: 8,
        group: "neuropsychiatric",
      },
      {
        key: "vasculitis",
        label: "Vasculitis",
        description: "Ulceración, gangrena, nódulos digitales dolorosos, infartos periungueales, hemorragias en astilla, biopsia o angiografía confirmatoria.",
        weight: 8,
        group: "neuropsychiatric",
      },
    ],
  },
  {
    id: "musculoskeletal",
    label: "Musculoesquelético",
    color: "text-blue-700",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-50",
    items: [
      {
        key: "arthritis",
        label: "Artritis",
        description: "≥2 articulaciones con dolor e inflamación (sensibilidad, tumefacción o derrame).",
        weight: 4,
        group: "musculoskeletal",
      },
      {
        key: "myositis",
        label: "Miositis",
        description: "Debilidad o dolor muscular proximal con elevación de CPK/aldolasa, cambios en EMG o biopsia confirmatoria.",
        weight: 4,
        group: "musculoskeletal",
      },
    ],
  },
  {
    id: "renal",
    label: "Renal",
    color: "text-red-700",
    borderColor: "border-red-500",
    bgColor: "bg-red-50",
    items: [
      {
        key: "urinary_casts",
        label: "Cilindros urinarios",
        description: "Cilindros hemáticos, granulosos o eritrocitarios en el sedimento urinario.",
        weight: 4,
        group: "renal",
      },
      {
        key: "hematuria",
        label: "Hematuria",
        description: ">5 eritrocitos/campo de alta potencia. Excluir litiasis, infección u otras causas.",
        weight: 4,
        group: "renal",
      },
      {
        key: "proteinuria",
        label: "Proteinuria",
        description: ">0,5 g/24 h de nueva aparición o incremento reciente >0,5 g/24 h.",
        weight: 4,
        group: "renal",
      },
      {
        key: "pyuria",
        label: "Piuria",
        description: ">5 leucocitos/campo de alta potencia. Excluir infección urinaria.",
        weight: 4,
        group: "renal",
      },
    ],
  },
  {
    id: "skin",
    label: "Piel y mucosas",
    color: "text-orange-700",
    borderColor: "border-orange-500",
    bgColor: "bg-orange-50",
    items: [
      {
        key: "rash",
        label: "Erupción",
        description: "Nueva aparición o recurrencia de erupción inflamatoria de tipo lúpico.",
        weight: 2,
        group: "skin",
      },
      {
        key: "alopecia",
        label: "Alopecia",
        description: "Nueva aparición o recurrencia de pérdida anormal del cabello, parcheada o difusa.",
        weight: 2,
        group: "skin",
      },
      {
        key: "mucosal_ulcers",
        label: "Úlceras mucosas",
        description: "Nueva aparición o recurrencia de úlceras orales o nasales.",
        weight: 2,
        group: "skin",
      },
    ],
  },
  {
    id: "serosal",
    label: "Serosas",
    color: "text-teal-700",
    borderColor: "border-teal-500",
    bgColor: "bg-teal-50",
    items: [
      {
        key: "pleuritis",
        label: "Pleuritis",
        description: "Dolor pleurítico con frote/derrame pleural o nuevo engrosamiento pleural.",
        weight: 2,
        group: "serosal",
      },
      {
        key: "pericarditis",
        label: "Pericarditis",
        description: "Dolor pericárdico con al menos uno de: frote, derrame, confirmación por ECG o ecocardiograma.",
        weight: 2,
        group: "serosal",
      },
    ],
  },
  {
    id: "immunologic",
    label: "Inmunológico",
    color: "text-indigo-700",
    borderColor: "border-indigo-500",
    bgColor: "bg-indigo-50",
    items: [
      {
        key: "low_complement",
        label: "Complemento bajo",
        description: "Descenso de CH50, C3 o C4 por debajo del límite inferior normal del laboratorio.",
        weight: 2,
        group: "immunologic",
      },
      {
        key: "dna_binding",
        label: "Anti-DNA elevado",
        description: ">25% de unión por ensayo de Farr o por encima del rango normal del laboratorio.",
        weight: 2,
        group: "immunologic",
      },
    ],
  },
  {
    id: "general",
    label: "General",
    color: "text-gray-700",
    borderColor: "border-gray-500",
    bgColor: "bg-gray-50",
    items: [
      {
        key: "fever",
        label: "Fiebre",
        description: ">38 °C tras exclusión de infección.",
        weight: 1,
        group: "general",
      },
      {
        key: "thrombocytopenia",
        label: "Trombocitopenia",
        description: "<100.000 plaquetas/mm³. Excluir causas farmacológicas.",
        weight: 1,
        group: "general",
      },
      {
        key: "leukopenia",
        label: "Leucopenia",
        description: "<3.000 leucocitos/mm³. Excluir causas farmacológicas.",
        weight: 1,
        group: "general",
      },
    ],
  },
];

export function calculateScore(checked: Set<SledaiItemKey>): number {
  let total = 0;
  for (const group of SLEDAI_GROUPS) {
    for (const item of group.items) {
      if (checked.has(item.key)) total += item.weight;
    }
  }
  return total;
}

export function getInterpretation(score: number): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  if (score === 0) return { label: "Sin actividad", color: "text-gray-600", bgColor: "bg-gray-100", borderColor: "border-gray-300" };
  if (score <= 5) return { label: "Actividad leve", color: "text-green-700", bgColor: "bg-green-100", borderColor: "border-green-400" };
  if (score <= 10) return { label: "Actividad moderada", color: "text-yellow-700", bgColor: "bg-yellow-100", borderColor: "border-yellow-400" };
  if (score <= 19) return { label: "Actividad alta", color: "text-orange-700", bgColor: "bg-orange-100", borderColor: "border-orange-400" };
  return { label: "Actividad muy alta", color: "text-red-700", bgColor: "bg-red-100", borderColor: "border-red-400" };
}
