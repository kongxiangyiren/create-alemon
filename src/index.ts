#!/usr/bin/env node
import prompts from 'prompts';
import { existsSync, rmSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { red } from 'kolorist';

async function start() {
  let result: prompts.Answers<'name' | 'overwrite' | 'overwriteChecker' | 'plugins'>;

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
        },
        {
          type: 'multiselect',
          name: 'plugins',
          message: '选择插件: ',
          choices: [
            // disabled :禁用 selected :默认选择
            // { title: 'Green', value: '#00ff00', disabled: true },
            { title: 'alemon-plugin', value: 'alemon-plugin', selected: true },
            { title: 'Sky', value: 'Sky' },
            { title: 'xianyu-plugin-alemon', value: 'xianyu-plugin-alemon' },
            { title: 'alemon-plugin-kong', value: 'alemon-plugin-kong' },
            { title: 'alemon-plugin-1999', value: 'alemon-plugin-1999' }
          ]
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

  const { name, overwrite, plugins } = result;

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
  setPlugins(name, plugins);

  console.log(`------------------------------------`);
  console.log(`----------Alemon-Bot----------------`);
  console.log(`------------------------------------`);
  console.log(`cd ${name}  #Entering the project`);
  console.log(`npm install #Load Dependencies`);
  console.log(`npm run app #Firing app`);
  console.log(`------------------------------------`);
}
start();

function setPlugins(name: string, plugins: Array<string>) {
  // 安装测试插件
  if (plugins.includes('alemon-plugin')) {
    console.log('开始安装 alemon-plugin');

    execSync(
      `cd ./${name} && git clone --depth=1 https://gitee.com/ningmengchongshui/alemon-plugin.git ./plugins/alemon-plugin/`,
      {
        stdio: 'inherit'
      }
    );

    console.log('安装 alemon-plugin 完成');
  }

  if (plugins.includes('Sky')) {
    console.log('开始安装 Sky');

    execSync(`cd ./${name} && git clone https://gitee.com/Tloml-Starry/Sky.git ./plugins/Sky/`, {
      stdio: 'inherit'
    });

    console.log('安装 Sky 完成');
  }

  if (plugins.includes('xianyu-plugin-alemon')) {
    console.log('开始安装 xianyu-plugin-alemon');

    execSync(
      `cd ./${name} && git clone --depth=1 https://gitee.com/suancaixianyu/xianyu-plugin-alemon.git ./plugins/xianyu-plugin-alemon/`,
      {
        stdio: 'inherit'
      }
    );

    console.log('安装 xianyu-plugin-alemon 完成');
  }

  if (plugins.includes('alemon-plugin-kong')) {
    console.log('开始安装 alemon-plugin-kong');

    execSync(
      `cd ./${name} && git clone https://gitee.com/fei-yuhao/alemon-plugin-kong.git ./plugins/alemon-plugin-kong/`,
      {
        stdio: 'inherit'
      }
    );

    console.log('安装 alemon-plugin-kong 完成');
  }

  if (plugins.includes('alemon-plugin-1999')) {
    console.log('开始安装 alemon-plugin-1999');

    execSync(
      `cd ./${name} && git clone https://gitee.com/fantasy-hx/alemon-plugin-1999.git ./plugins/alemon-plugin-1999`,
      {
        stdio: 'inherit'
      }
    );

    console.log('安装 alemon-plugin-1999 完成');
  }
}
