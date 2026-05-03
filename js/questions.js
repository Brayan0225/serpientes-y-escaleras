// Banco de preguntas sobre Literatura Medieval Española
const DEFAULT_QUESTIONS = [
    {
        id: 1,
        question: "¿Cuál es la obra cumbre de la épica medieval castellana?",
        options: ["Libro de Buen Amor", "Cantar de Mio Cid", "El Conde Lucanor", "La Celestina"],
        correct: 1
    },
    {
        id: 2,
        question: "¿Quién es el autor de 'Milagros de Nuestra Señora'?",
        options: ["Juan Ruiz", "Don Juan Manuel", "Gonzalo de Berceo", "Fernando de Rojas"],
        correct: 2
    },
    {
        id: 3,
        question: "¿Qué son las jarchas?",
        options: [
            "Poemas épicos en latín",
            "Breves composiciones líricas en mozárabe al final de las moaxajas",
            "Canciones de gesta francesas",
            "Oraciones religiosas medievales"
        ],
        correct: 1
    },
    {
        id: 4,
        question: "¿Quién escribió 'El Libro de Buen Amor'?",
        options: ["Alfonso X el Sabio", "Gonzalo de Berceo", "Juan Ruiz, Arcipreste de Hita", "Don Juan Manuel"],
        correct: 2
    },
    {
        id: 5,
        question: "¿Cuál es la diferencia principal entre el mester de juglaría y el mester de clerecía?",
        options: [
            "El de juglaría es oral e irregular; el de clerecía es escrito y usa cuaderna vía",
            "No hay diferencia, son sinónimos",
            "El de clerecía es oral y el de juglaría es escrito",
            "El de juglaría usa latín y el de clerecía usa romance"
        ],
        correct: 0
    },
    {
        id: 6,
        question: "¿Quién es el autor de 'El Conde Lucanor'?",
        options: ["Fernando de Rojas", "Juan Ruiz", "Don Juan Manuel", "Alfonso X el Sabio"],
        correct: 2
    },
    {
        id: 7,
        question: "¿Qué tipo de estrofa caracteriza al mester de clerecía?",
        options: ["Soneto", "Romance", "Cuaderna vía", "Décima"],
        correct: 2
    },
    {
        id: 8,
        question: "¿Quién es considerado el autor de 'La Celestina'?",
        options: ["Gonzalo de Berceo", "Fernando de Rojas", "Juan Ruiz", "Marqués de Santillana"],
        correct: 1
    },
    {
        id: 9,
        question: "¿Cómo se llama el héroe del Cantar de Mio Cid?",
        options: ["Fernán González", "Rodrigo Díaz de Vivar", "Alfonso VI", "Bernardo del Carpio"],
        correct: 1
    },
    {
        id: 10,
        question: "¿En qué siglo se compuso el Cantar de Mio Cid aproximadamente?",
        options: ["Siglo X", "Siglo XII - XIII", "Siglo XV", "Siglo IX"],
        correct: 1
    },
    {
        id: 11,
        question: "¿Qué es una moaxaja?",
        options: [
            "Un tipo de armadura medieval",
            "Un poema estrófico hispanoarebe con jarcha al final",
            "Una crónica histórica",
            "Un instrumento musical"
        ],
        correct: 1
    },
    {
        id: 12,
        question: "¿Cuál es el tema central de 'El Conde Lucanor'?",
        options: [
            "El amor cortés",
            "La guerra contra los moros",
            "Enseñanzas morales a través de exemplos (cuentos)",
            "La vida de los santos"
        ],
        correct: 2
    },
    {
        id: 13,
        question: "¿Qué rey impulsó la Escuela de Traductores de Toledo y las obras en prosa castellana?",
        options: ["Fernando III", "Alfonso X el Sabio", "Sancho IV", "Pedro I"],
        correct: 1
    },
    {
        id: 14,
        question: "¿Cuál es el nombre de la alcahueta protagonista de 'La Celestina'?",
        options: ["Melibea", "Celestina", "Areúsa", "Elicia"],
        correct: 1
    },
    {
        id: 15,
        question: "¿Qué personaje acompaña al Cid en sus hazañas como su fiel amigo?",
        options: ["Álvar Fáñez Minaya", "Fernán González", "García Ordóñez", "El rey Alfonso"],
        correct: 0
    },
    {
        id: 16,
        question: "¿Qué obra medieval española mezcla elementos autobiográficos con fábulas y sátira?",
        options: ["Cantar de Mio Cid", "La Celestina", "Libro de Buen Amor", "El Conde Lucanor"],
        correct: 2
    },
    {
        id: 17,
        question: "¿Qué tipo de composición es el Romancero?",
        options: [
            "Colección de novelas",
            "Conjunto de poemas narrativos breves en versos octosílabos",
            "Tratado filosófico",
            "Obra teatral religiosa"
        ],
        correct: 1
    },
    {
        id: 18,
        question: "¿En qué consiste la 'cuaderna vía'?",
        options: [
            "Versos de arte menor con rima asonante",
            "Estrofas de 4 versos alejandrinos con rima consonante monorrima (AAAA)",
            "Estrofas de 3 versos endecasílabos",
            "Versos libres sin métrica fija"
        ],
        correct: 1
    },
    {
        id: 19,
        question: "¿Qué obra de Gonzalo de Berceo narra 25 relatos sobre intervenciones de la Virgen María?",
        options: ["Vida de Santo Domingo", "Milagros de Nuestra Señora", "Vida de San Millán", "El sacrificio de la Misa"],
        correct: 1
    },
    {
        id: 20,
        question: "¿Cuál es el desenlace de 'La Celestina'?",
        options: [
            "Los amantes se casan felizmente",
            "Calisto muere al caer de una escalera, Melibea se suicida y Celestina es asesinada",
            "Celestina une a los amantes y todos viven en paz",
            "El rey perdona a todos los personajes"
        ],
        correct: 1
    },
    {
        id: 21,
        question: "¿Qué significa 'Mio Cid'?",
        options: ["Mi rey", "Mi señor", "Mi guerrero", "Mi padre"],
        correct: 1
    },
    {
        id: 22,
        question: "¿Cómo se llaman las hijas del Cid en el Cantar?",
        options: ["María y Juana", "Elvira y Sol", "Isabel y Teresa", "Jimena y Leonor"],
        correct: 1
    },
    {
        id: 23,
        question: "¿Qué ciudad conquistó el Cid a los moros, convirtiéndola en su mayor logro militar?",
        options: ["Toledo", "Sevilla", "Valencia", "Granada"],
        correct: 2
    },
    {
        id: 24,
        question: "¿En cuántos cantares se divide el Cantar de Mio Cid?",
        options: ["Dos", "Tres", "Cuatro", "Cinco"],
        correct: 1
    },
    {
        id: 25,
        question: "¿Qué nombre recibe el primer cantar del Poema de Mio Cid?",
        options: ["Cantar de las bodas", "Cantar del destierro", "Cantar de la afrenta de Corpes", "Cantar de la conquista"],
        correct: 1
    },
    {
        id: 26,
        question: "¿Qué es un 'exemplum' en la literatura medieval?",
        options: [
            "Un poema de amor",
            "Un cuento breve con finalidad didáctica o moral",
            "Una oración religiosa",
            "Un documento legal"
        ],
        correct: 1
    },
    {
        id: 27,
        question: "¿Quiénes son Calisto y Melibea?",
        options: [
            "Reyes de Castilla",
            "Los jóvenes enamorados protagonistas de La Celestina",
            "Santos medievales",
            "Personajes del Cantar de Mio Cid"
        ],
        correct: 1
    },
    {
        id: 28,
        question: "¿Qué lengua se usaba principalmente en los textos cultos medievales antes del castellano?",
        options: ["Griego", "Árabe", "Latín", "Francés"],
        correct: 2
    },
    {
        id: 29,
        question: "¿Qué figura retórica consiste en exagerar las cualidades del héroe en los cantares de gesta?",
        options: ["Metáfora", "Hipérbole", "Ironía", "Aliteración"],
        correct: 1
    },
    {
        id: 30,
        question: "¿Cuál era la función principal de los juglares en la Edad Media?",
        options: [
            "Escribir libros en los monasterios",
            "Recitar y cantar obras literarias ante el público",
            "Gobernar los pueblos",
            "Enseñar en las universidades"
        ],
        correct: 1
    },
    {
        id: 31,
        question: "¿Qué obra medieval usa el personaje de 'Trotaconventos' como intermediaria amorosa?",
        options: ["La Celestina", "Libro de Buen Amor", "El Conde Lucanor", "Cantar de Mio Cid"],
        correct: 1
    },
    {
        id: 32,
        question: "¿Qué nombre recibe el consejero de El Conde Lucanor que le da enseñanzas?",
        options: ["Sancho", "Patronio", "Alfonso", "Rodrigo"],
        correct: 1
    },
    {
        id: 33,
        question: "¿En qué siglo vivió Gonzalo de Berceo, primer poeta castellano de nombre conocido?",
        options: ["Siglo X", "Siglo XIII", "Siglo XV", "Siglo XVII"],
        correct: 1
    },
    {
        id: 34,
        question: "¿Qué espada famosa pertenecía al Cid?",
        options: ["Excalibur", "Tizona", "Durandal", "Joyosa"],
        correct: 1
    },
    {
        id: 35,
        question: "¿Qué género literario es 'La Celestina'?",
        options: [
            "Novela de caballerías",
            "Poesía épica",
            "Tragicomedia (obra dramática dialogada)",
            "Crónica histórica"
        ],
        correct: 2
    },
    {
        id: 36,
        question: "¿Qué caracteriza a la literatura del mester de clerecía?",
        options: [
            "Es anónima y se transmite oralmente",
            "Es escrita por clérigos cultos, con métrica regular y temas religiosos o morales",
            "Solo trata temas de guerra",
            "Está escrita en árabe"
        ],
        correct: 1
    },
    {
        id: 37,
        question: "¿Qué obra de Alfonso X el Sabio recopila la historia de España?",
        options: ["Las Cantigas", "Estoria de España (Primera Crónica General)", "El Conde Lucanor", "Libro de Buen Amor"],
        correct: 1
    },
    {
        id: 38,
        question: "¿Qué son los romances fronterizos?",
        options: [
            "Poemas sobre el amor en la corte",
            "Romances que narran episodios de la frontera entre cristianos y moros",
            "Canciones religiosas de los monasterios",
            "Obras de teatro medievales"
        ],
        correct: 1
    },
    {
        id: 39,
        question: "¿Qué tema principal trata el 'Libro de Buen Amor' de Juan Ruiz?",
        options: [
            "La conquista de territorios",
            "El amor en sus diversas formas (humano y divino), con tono humorístico y satírico",
            "La vida de los santos",
            "Las guerras entre reinos"
        ],
        correct: 1
    },
    {
        id: 40,
        question: "¿Cómo se llama la esposa del Cid en el Cantar?",
        options: ["Leonor", "Urraca", "Doña Jimena", "Doña Sancha"],
        correct: 2
    }
];

function loadQuestions() {
    const stored = localStorage.getItem('snl_questions');
    if (stored) {
        return JSON.parse(stored);
    }
    saveQuestions(DEFAULT_QUESTIONS);
    return [...DEFAULT_QUESTIONS];
}

function saveQuestions(questions) {
    localStorage.setItem('snl_questions', JSON.stringify(questions));
}

function resetQuestions() {
    saveQuestions(DEFAULT_QUESTIONS);
    return [...DEFAULT_QUESTIONS];
}

function getRandomQuestion(usedIds) {
    const questions = loadQuestions();
    const available = questions.filter(q => !usedIds.includes(q.id));
    if (available.length === 0) {
        usedIds.length = 0;
        return questions[Math.floor(Math.random() * questions.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
}
