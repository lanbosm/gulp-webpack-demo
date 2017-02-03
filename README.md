##gulp+webpack 打包模板   
	参照了网易那个打包配置 因为年代比较古老 webpack还是beta...
	自己又加工了下 感谢网易大佬 学习了很多

- 包含一个browser-sync服务器作为热刷新 也可以用webpackdevserver服务器
- gulp管理html css less, webpack只管理js 
- webpack只装了es6的loader 完善中...

## 需要环境
	Node.js：v6.5+

##不足之处
- 图片还不能压缩
- webpackdevserver服务器环境没配置好



compass（非必须）：v1.0+
##### 目录结构

├── dist                 # compass配置
├── src               # gulp任务配置
├── mock/                     # 假数据文件
├── package.json              # 项目配置
├── README.md                 # 项目说明
├── server                    # 本地server
│   ├── app.js                # 本地server入口
│   ├── home.html             # 列出项目所有入口文件
│   └── routes.js             # 本地路由配置
├── src                       # 源码目录
│   ├── a.html                # 入口文件a
│   ├── b.html                # 入口文件b
│   ├── c.html                # 入口文件c
│   ├── css/                  # css资源
│   ├── img/                  # 图片资源
│   ├── js                    # js&jsx资源
│   │   ├── a.js              # a页面入口
│   │   ├── b.js              # b页面入口
│   │   ├── c.js              # c页面入口
│   │   ├── components/       # 组件
│   │   ├── helpers/          # 业务相关的辅助工具
│   │   ├── lib/              # 没有存放在npm的第三方库或者下载存放到本地的基础库，如jQuery、Zepto、React等
│   │   └── utils/            # 业务无关的辅助工具
│   ├── scss/                 # scss资源
│   ├── pathmap.json          # 手动配置某些模块的路径，可以加快webpack的编译速度
│   └── tmpl/                 # 模板目录，如果是React的项目这个可以删掉
├── make-webpack.config.js    # webpack配置
├── webpack.config.js         # 正式环境webpack配置入口
└── webpack-dev.config.js     # 开发环境webpack配置入口
## How to use
    npm run install 然后npm run gulp
    建议使用webstorm sublime开发


### 修改日志

#### 2017.2.3

- 第一次上传
  
  