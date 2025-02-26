let planilhaDados = []; // Variável para armazenar os dados do XLSX

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Pegando a primeira aba da planilha
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertendo a planilha para JSON e ajustando os cabeçalhos
        planilhaDados = XLSX.utils.sheet_to_json(sheet);

        // 🔥 Normaliza os cabeçalhos removendo espaços extras
        planilhaDados = planilhaDados.map(row => {
            let newRow = {};
            Object.keys(row).forEach(key => {
                const newKey = key.trim(); // Remove espaços extras no nome do cabeçalho
                newRow[newKey] = row[key];
            });
            return newRow;
        });

        console.log("Dados carregados:", planilhaDados); // DEBUG: Ver se os dados estão certos

        // Preencher o dropdown com os nomes
        preencherDropdown();
    };

    reader.readAsArrayBuffer(file);
});

// Função para preencher o select com os nomes da planilha
function preencherDropdown() {
    const select = document.getElementById("nameSelect");
    select.innerHTML = '<option value="">Selecione um nome</option>'; // Reseta a lista

    planilhaDados.forEach((dado, index) => {
        if (dado["Nome"]) {
            const option = document.createElement("option");
            option.value = index; // Usa o índice para referenciar a linha da planilha
            option.textContent = dado["Nome"];
            select.appendChild(option);
        }
    });

    console.log("Nomes carregados no select:", select.innerHTML); // DEBUG: Ver se os nomes estão sendo adicionados
}

// Evento para mostrar os dados quando selecionar um nome
document.getElementById("nameSelect").addEventListener("change", function () {
    const index = this.value;
    if (index !== "") {
        exibirDados(planilhaDados[index]);
    }
});

// Função para exibir os dados nos labels
function exibirDados(dados) {
    for (const key in dados) {
        const campo = document.getElementById(key);
        if (campo) {
            campo.textContent = dados[key] || "Não informado"; // Evita valores vazios
        }
    }
}
