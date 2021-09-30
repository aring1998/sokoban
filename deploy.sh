# 执行部署: Bash -> sh deploy.sh

rm -rf dist &&
npm run build &&
cd dist &&
git init &&
git add . &&
git commit -m "webpack" &&
git branch -M master &&
git remote add origin https://gitee.com/aring1998/sokoban-online.git
git push -f -u origin master &&
cd ..
