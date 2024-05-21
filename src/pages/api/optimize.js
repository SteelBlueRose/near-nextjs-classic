import { spawn } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  const { tasks } = req.body;

  const pythonProcess = spawn('python', [path.resolve('./python/optimizer.py'), JSON.stringify(tasks)]);

  pythonProcess.stdout.on('data', (data) => {
    res.status(200).json({ result: JSON.parse(data.toString()) });
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}
