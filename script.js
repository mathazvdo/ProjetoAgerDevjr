const API_URL = "http://localhost:8080/funcionarios";

async function listarFuncionarios() {

    mostrarLoader();

    try {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(API_URL);

        const funcionarios = await response.json();

        mostrarFuncionarios(funcionarios);

    } catch (error) {

        alert("Erro ao buscar funcionários");
        console.error(error);

    } finally {

        esconderLoader();
    }
}

async function abrirTelaFuncionarios() {
    window.location.href = "funcionarios.html";
}


async function mostrarLoader() {
    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");
}

async function esconderLoader() {
    const loader = document.getElementById("loader");
    loader.classList.add("hidden");
}

async function buscarFuncionario() {

    const codigo = document.getElementById("buscarCodigo").value;

    if (!codigo) {
        alert("Informe o código");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${codigo}`);

        if (!response.ok) {
            alert("Funcionário não encontrado");
            return;
        }

        const funcionario = await response.json();

        mostrarFuncionarios([funcionario]);

    } catch (error) {

        alert("Funcionário não encontrado");
        console.error(error);
    }
}

async function cadastrarFuncionario() {

    const funcionario = pegarDadosFormulario();

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(funcionario)
        });

        if (!response.ok) {
            throw new Error();
        }

        alert("Funcionário cadastrado com sucesso");

        limparCampos();

    } catch (error) {

        alert("Erro ao cadastrar funcionário");
        console.error(error);
    }
}

async function atualizarFuncionario() {

    const funcionario = pegarDadosFormulario();

    if (!funcionario.codigo) {
        alert("Informe o código");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${funcionario.codigo}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(funcionario)
        });

        if (!response.ok) {
            throw new Error();
        }

        alert("Funcionário atualizado com sucesso");

        limparCampos();

    } catch (error) {

        alert("Erro ao atualizar funcionário");
        console.error(error);
    }
}

async function excluirFuncionario(codigo) {

    const confirmar = confirm("Deseja excluir este funcionário?");

    if (!confirmar) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${codigo}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error();
        }

        alert("Funcionário excluído com sucesso");

        if (window.location.pathname.includes("funcionarios.html")) {

            carregarTabelaFuncionarios();

        } else {

            listarFuncionarios();
        }

    } catch (error) {

        alert("Erro ao excluir funcionário");
        console.error(error);
    }
}

function mostrarFuncionarios(funcionarios) {

    const lista = document.getElementById("listaFuncionarios");

    lista.innerHTML = "";

    funcionarios.forEach(funcionario => {

        lista.innerHTML += `
        
            <div class="card-funcionario">

                <h3>${funcionario.nome}</h3>

                <p><strong>Código:</strong> ${funcionario.codigo}</p>

                <p><strong>CPF:</strong> ${funcionario.cpf}</p>

                <p><strong>Cargo:</strong> ${funcionario.cargo}</p>

                <p><strong>Data Nascimento:</strong> ${formatarData(funcionario.dataNascimento)}</p>

                <div class="acoes">

                    <a class="icon edit" title="Editar"
        onclick='editarFuncionario(${JSON.stringify(funcionario)})'>
        <i class="fa-solid fa-pen-to-square"></i>
    </a>

    <a class="icon delete" title="Excluir"
        onclick="excluirFuncionario(${funcionario.codigo})">
        <i class="fa-solid fa-trash"></i>
    </a>

                </div>

            </div>
        `;
    });
}

function editarFuncionario(funcionario) {

    document.getElementById("codigo").value = funcionario.codigo;
    document.getElementById("nome").value = funcionario.nome;
    document.getElementById("cpf").value = funcionario.cpf;
    document.getElementById("cargo").value = funcionario.cargo;
    document.getElementById("dataNascimento").value = funcionario.dataNascimento;

    document.getElementById("codigo").disabled = true;
}

function limparCampos() {

    document.getElementById("codigo").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("cargo").value = "";
    document.getElementById("dataNascimento").value = "";

    document.getElementById("codigo").disabled = false;
}

function pegarDadosFormulario() {

    return {
        codigo: document.getElementById("codigo").value,
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        cargo: document.getElementById("cargo").value,
        dataNascimento: document.getElementById("dataNascimento").value
    };


}

function formatarData(data) {

    const novaData = new Date(data);

    return novaData.toLocaleDateString('pt-BR');
}

async function carregarTabelaFuncionarios() {

    const tabela = document.getElementById("tabelaFuncionarios");

    if (!tabela) {
        return;
    }

    mostrarLoader();

    try {

        await new Promise(resolve => setTimeout(resolve, 800));

        const response = await fetch(API_URL);

        const funcionarios = await response.json();

        tabela.innerHTML = "";

        funcionarios.forEach(funcionario => {

            tabela.innerHTML += `
            
                <tr>

                    <td>${funcionario.codigo}</td>

                    <td>${funcionario.nome}</td>

                    <td>${funcionario.cpf}</td>

                    <td>${funcionario.cargo}</td>

                    <td>${formatarData(funcionario.dataNascimento)}</td>

                    <td>

                        <a class="icon edit" title="Editar"
        onclick='editarDaTabela(${JSON.stringify(funcionario)})'>
        <i class="fa-solid fa-pen-to-square"></i>
    </a>

    <a class="icon delete" title="Excluir"
        onclick="excluirFuncionario(${funcionario.codigo})">
        <i class="fa-solid fa-trash"></i>
    </a>
                    </td>

                </tr>
            `;
        });

    } catch (error) {

        alert("Erro ao carregar funcionários");
        console.error(error);

    } finally {

        esconderLoader();
    }
}

function voltarTelaInicial() {
    window.location.href = "index.html";
}

function editarDaTabela(funcionario) {

    localStorage.setItem(
        "funcionarioEditar",
        JSON.stringify(funcionario)
    );

    window.location.href = "index.html";
}

if (window.location.pathname.includes("funcionarios.html")) {
    carregarTabelaFuncionarios();
}