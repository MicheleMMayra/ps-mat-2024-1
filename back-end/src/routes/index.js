let tempData = {}; // Variável para armazenar

router.post('/', (req, res) => {
    const newData = req.body;
    tempData = newData; // Armazena os valores temporariamente 
    res.status(200).send('Dados armazenados com sucesso');
});

router.get('/data', (req, res) => {
    res.status(200).json(tempData); // Retorna os valor armazenado
});
