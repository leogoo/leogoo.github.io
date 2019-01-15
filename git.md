### 冲突处理方法
1. 先全都ci，然后git pull把所有代码都拉下来修改冲突（属于自己的，其他撤回就好了，反正不提交）
1. (优先）提交前Git stash -> git pull -> git stash pop
保持本地和远端同步(pull前记得git stash),多出的文件就都是自己本地修改的

### 常用命令：
- git reflog show —date=iso 很关键，很好用
- git stash -u :缓存所有内容包括新建的
- git clean -fd:删除untraked files和目录
- git checkout . 删除所有未加入缓存区的文件
- git diff <分支名>:比较当前分支与指定分支代码的差别

### Git reset
1. 使用--soft就仅仅将头指针恢复，已经add的缓存以及工作空间的所有东西都不变。
2. 使用--mixed，就将头恢复掉，已经add的缓存也会丢失掉，工作空间的代码什么的是不变的。
3. 如果使用--hard，那么一切就全都恢复了，头变，aad的缓存消失，代码什么的也恢复到以前状态。

### git revert
- git revert commitId是将指定的commit反转，与reset不同的是会生成一个新的commit，而内容则是反转对应的commit内容。reset需要git push -f强制回退才会改变远程分支
- 一般冲突时，保留parent版本的内容，执行git revert --continue
- 如果不想解决冲突的话可以取消撤回：git revert --abort