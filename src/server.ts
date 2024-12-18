import * as path from 'path';

import { fifo } from "./techniques/fifo";
import { sjf } from "./techniques/sjf";
import { srt } from './techniques/srt';
import { rr } from './techniques/rr';

import { getTestFiles, readFile, writeFile } from "./utils/loadFile";


const directory = "C://Users//upflo//OneDrive//Área de Trabalho//IFMG//process-escalator-so//src//docs";
const directoryDestiny = path.resolve(__dirname, './doc-parsed');
const files = getTestFiles(directory);

files.forEach(file => {
    const { quantum, processes } = readFile(path.resolve(directory, file));
    const fifoMetrics = fifo([...processes]);
    const sjfMetrics = sjf([...processes]);
    const srtMetrics = srt([...processes]);
    const rrMetrics = rr([...processes], quantum);

    const outputFileName = file.replace('.txt', '-RESULTADO.txt');
    writeFile(path.join(directoryDestiny, outputFileName), [fifoMetrics, sjfMetrics, srtMetrics, rrMetrics]);
})