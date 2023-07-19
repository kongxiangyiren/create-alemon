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
            { title: '测试插件', value: 'alemon-plugin', selected: true },
            { title: '光遇插件', value: 'Sky' },
            { title: 'kong 插件', value: 'alemon-plugin-kong' },
            { title: '1999 图鉴', value: 'alemon-plugin-1999' },
            {
              title: '阴天插件',
              value: 'y-tian-plugin-for-alemon-bot'
              // disabled: true
            },
            { title: '土块插件', value: 'alemon-earth-k-plugin' },

            { title: '咸鱼插件', value: 'xianyu-plugin-alemon' },
            { title: '修仙插件', value: 'xiuxian-plugin', disabled: true }
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
      `git clone --depth=1 -b template-qq https://gitee.com/ningmengchongshui/alemon.git ${join(
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
      `cd ./${name} && git clone --depth=1 -b plugin https://gitee.com/ningmengchongshui/alemon.git ./plugins/alemon-plugin/`,
      {
        stdio: 'inherit'
      }
    );

    console.log('安装 alemon-plugin 完成');
  }

  // 光遇插件
  if (plugins.includes('Sky')) {
    console.log('开始安装 Sky');

    execSync(`cd ./${name} && git clone https://gitee.com/Tloml-Starry/Sky.git ./plugins/Sky/`, {
      stdio: 'inherit'
    });

    console.log('安装 Sky 完成');
  }

  // 空空插件
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

  // 1999插件
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

  //阴天插件
  if (plugins.includes('y-tian-plugin-for-alemon-bot')) {
    console.log('开始安装 y-tian-plugin-for-alemon-bot');

    execSync(
      `cd ./${name} && git clone https://gitee.com/wan13877501248/y-tian-plugin-for-alemon-bot.git ./plugins/y-tian-plugin/`,
      {
        stdio: 'inherit'
      }
    );

    console.log('安装 y-tian-plugin-for-alemon-bot 完成');
  }

  // 土块插件
  if (plugins.includes('alemon-earth-k-plugin')) {
    console.log('开始安装 alemon-earth-k-plugin');

    execSync(
      `cd ./${name} && git clone https://gitee.com/diqiushengwu/alemon-earth-k-plugin.git ./plugins/earth-k-plugin/`,
      {
        stdio: 'inherit'
      }
    );

    console.log('安装 alemon-earth-k-plugin 完成');
  }

  // 咸鱼插件
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

  // 修仙插件
  if (plugins.includes('xiuxian-plugin')) {
    console.log('开始安装 xiuxian-plugin');

    execSync(
      `cd ./${name} && git clone --depth=1 -b main https://gitee.com/ningmengchongshui/xiuxian-plugin.git ./plugins/xiuxian-plugin/`,
      {
        stdio: 'inherit'
      }
    );

    console.log('安装 xiuxian-plugin 完成');
  }
}
