const API_URL = "http://localhost:8080/funcionarios";

async function tratarRespostaErro(response) {

    if (!response.ok) {

        const {
            message
        } = await response.json();

        throw new Error(message);
    }
}


async function listarFuncionarios() {

    mostrarLoader();

    try {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(API_URL);

         await tratarRespostaErro(response);

        const funcionarios = await response.json();

        mostrarFuncionarios(funcionarios);

    } catch (error) {

        mostrarMensagemErro(error.message);

    } finally {

        esconderLoader();
    }
}

function abrirTelaFuncionarios() {
    window.location.href = "funcionarios.html";
}


function mostrarLoader() {
    const loader = document.getElementById("loader");
    loader.classList.remove("hidden");
}

function esconderLoader() {
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

        await tratarRespostaErro(response);

        const funcionario = await response.json();

        mostrarFuncionarios([funcionario]);

    } catch (error) {

        mostrarMensagemErro(error.message);
        
    }
}

async function cadastrarFuncionario() {

    const funcionario = pegarDadosFormulario();
    console.log("testeee");
    validarFormulario(funcionario);
    

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(funcionario)
        });

        await tratarRespostaErro(response);


        const sucesso = await response.json();

        mostrarMensagemSucesso(sucesso.message);

        limparCampos();

    } catch (error) {

        mostrarMensagemErro(error.message);

        console.error(error);
    }
}

async function atualizarFuncionario() {

    
    const funcionario = pegarDadosFormulario();
    validarFormulario(funcionario);

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
            await tratarRespostaErro(response);
        }

        const sucesso = await response.json();

        mostrarMensagemSucesso(sucesso.message);

        limparCampos();

    } catch (error) {
        mostrarMensagemErro(error.message);
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
            await tratarRespostaErro(response);
        }

        alert("Funcionário excluído com sucesso");

        if (window.location.pathname.includes("funcionarios.html")) {

            carregarTabelaFuncionarios();

        } else {

            listarFuncionarios();
        }

    } catch (error) {

        alert(error.message);
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
    document.getElementById("btnCadastrar").classList.add("hidden");
}

function limparCampos() {

    document.getElementById("codigo").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("cargo").value = "";
    document.getElementById("dataNascimento").value = "";

    const possuiEdicao =
        localStorage.getItem("funcionarioEditar");

    if (!possuiEdicao) {
        document.getElementById("codigo").disabled = false;
    }
}

function pegarDadosFormulario() {

    return {
        codigo: Number(document.getElementById("codigo").value) || null,
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

        alert(error.message);
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

function adicionarErroCampo(idCampo, mensagem) {

    const campo = document.getElementById(idCampo);

    campo.classList.add("input-erro");

    const erroExistente = campo.nextElementSibling;

    if (
        erroExistente &&
        erroExistente.classList.contains("mensagem-erro")
    ) {
        erroExistente.remove();
    }

    const mensagemErro = document.createElement("div");

    mensagemErro.classList.add("mensagem-erro");

    mensagemErro.innerText = mensagem;

    campo.insertAdjacentElement("afterend", mensagemErro);
}

function limparErrosFormulario() {

    document.querySelectorAll(".input-erro")
        .forEach(campo => {
            campo.classList.remove("input-erro");
        });

    document.querySelectorAll(".mensagem-erro")
        .forEach(erro => erro.remove());
}

function validarFormulario(funcionario) {

    limparErrosFormulario();

    let possuiErro = false;

    if (!funcionario.nome.trim()) {

        adicionarErroCampo(
            "nome",
            "Informe o nome do funcionário."
        );

        possuiErro = true;
    }

    if (!funcionario.cpf.trim()) {

        adicionarErroCampo(
            "cpf",
            "Informe o CPF do funcionário."
        );

        possuiErro = true;
    }

    if (!funcionario.cargo.trim()) {

        adicionarErroCampo(
            "cargo",
            "Informe o cargo do funcionário."
        );

        possuiErro = true;
    }

    if (!funcionario.dataNascimento) {

        adicionarErroCampo(
            "dataNascimento",
            "Informe a data de nascimento."
        );

        possuiErro = true;
    }

    if (possuiErro) {
        throw new Error(
            "Preencha os campos obrigatórios."
        );
    }
}
function mostrarMensagemSucesso(mensagem) {
    alert(mensagem);
}

function mostrarMensagemErro(mensagem) {
    alert(mensagem);
}