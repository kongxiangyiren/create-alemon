#!/usr/bin/env node
import prompts from 'prompts';
import { existsSync, rmSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { red } from 'kolorist';

async function start() {
  let result: prompts.Answers<'name' | 'overwrite' | 'overwriteChecker'>;

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'name',
          message: 'robot name',
          initial: 'alemon-bot',
          validate: value =>
            /^[a-z][0-9a-z_-]{0,}$/.test(value)
              ? true
              : '项目名称可选数字、小写字母、下划线、-,第一位必须是小写字母!'
        },
        {
          type: (_, { name }: { name: string }) =>
            !existsSync(join(process.cwd(), name)) ? null : 'confirm',
          name: 'overwrite',
          message: '项目已经存在,是否删除?'
        },
        {
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error(red('✖') + ' 操作被取消');
            }
            return null;
          },
          name: 'overwriteChecker'
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' 操作被取消');
        }
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return;
  }

  const { name, overwrite } = result;

  // 判断是否有相同的文件夹
  if (overwrite) {
    try {
      rmSync(join(process.cwd(), name), { recursive: true });
    } catch (error) {
      console.log(`Alemon-Bot ${error}`);
      process.exit();
    }
  }
  console.log(`Cloning Alemon-Bot for ${name}...`);
  try {
    execSync(
      `git clone --depth=1 https://gitee.com/ningmengchongshui/alemon-bot.git ${join(
        process.cwd(),
        name
      )}`,
      {
        stdio: 'inherit'
      }
    );
  } catch (error) {
    console.log(`Alemon-Bot ${error}`);
    return;
  }
  console.log('Alemon-Bot cloned successfully!');
  console.log(`------------------------------------`);
  console.log(`----------Alemon-Bot----------------`);
  console.log(`------------------------------------`);
  console.log(`cd ${name}  #Entering the project`);
  console.log(`npm install #Load Dependencies`);
  console.log(`npm run app #Firing app`);
  console.log(`------------------------------------`);
  console.log(`npm install pm2 -g #pm2`);
  console.log(`npm install ts-node -g #ts-node`);
  console.log(`npm run start #Background startup`);
  console.log(`------------------------------------`);
}
start();
