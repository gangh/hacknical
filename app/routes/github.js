import koaRouter from 'koa-router';
import Github from '../controllers/github';
import user from '../controllers/helper/user';
import cache from '../controllers/helper/cache';
import session from '../controllers/helper/session';
import query from '../controllers/helper/query';

const router = koaRouter({
  prefix: '/github'
});

// repos
router.get(
  '/repos',
  user.checkSession(session.requiredSessions),
  cache.get('repos'),
  Github.getRepos,
  cache.set()
);
router.get(
  '/repos/:reposName',
  user.checkSession(session.requiredSessions),
  Github.getRepository
);
router.get(
  '/user',
  user.checkSession(['userId']),
  cache.get('user'),
  Github.getUser,
  cache.set()
);
router.get(
  '/repos/commits',
  user.checkSession(session.requiredSessions),
  cache.get('commits'),
  Github.getCommits,
  cache.set()
);
router.get(
  '/repos/:reposName/commits',
  user.checkSession(session.requiredSessions),
  Github.getRepositoryCommits
);
router.get(
  '/:login',
  Github.sharePage
);
router.get(
  '/:login/share',
  cache.get('sharedUser'),
  Github.getSharedUser,
  cache.set()
);
router.get(
  '/:login/shareInfo',
  cache.get('sharedInfo'),
  Github.getStareInfo,
  cache.set()
)


module.exports = router;