import './App.css';
import { FaSistrix } from 'react-icons/fa';
import { useState } from 'react';
import api from './services/api';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [isDataVisible, setDataVisible] = useState(false);
  const [dataInfo, setDataInfo] = useState({});

  const handleChange = (e) => {
    const input = e.target;
    input.value = unmaskCep(input.value);
    input.value = maskCep(input.value);
    setInputValue(input.value);
  };

  const handleClick = () => {
    const unmaskedCep = unmaskCep(inputValue);
    getDataInfo(unmaskedCep);
    setDataVisible(true);
  };

  const getDataInfo = async (cep) => {
    try {
      const res = await api.get(`${cep}/json`);
      setDataInfo(res.data);
    } catch (err) {
      console.log('Erro de requisição à API: ' + err);
    };
  };

  const unmaskCep = (cep) => {
    let oldCep = cep;
    return oldCep.replace(/[^0-9]/g, '');
  };

  const maskCep = (cep) => {
    const cepReg = /^([0-9]{2})([0-9]{3})([0-9]{3})$/g;
    let oldCep = cep;
    return oldCep.replace(cepReg, '$1.$2-$3');
  };

  return (
    <div className="App">
      <h1>Buscador de Endereços</h1>
      <div className='cep-box'>
        <input
          className='cep-text'
          type={'text'}
          placeholder={'Insira o CEP'}
          maxLength={'10'}
          onChange={(e) => handleChange(e)}
        />
        <button className='cep-btn' onClick={() => handleClick()}>
          <FaSistrix size={27} />
        </button>
      </div>
      { isDataVisible ? <DataField data={dataInfo} /> : null }
    </div>
  );
};

const DataField = ({ data }) => {
  return (
    <div className='data-box'>
      <h2>Informações:</h2>
      <p><strong>Logradouro:</strong> {data.logradouro}</p>
      <p><strong>Bairro:</strong> {data.bairro}</p>
      <p><strong>Cidade:</strong> {data.localidade}</p>
      <p><strong>Estado:</strong> {data.uf}</p>
    </div>
  );
};

export default App;