export const ApiUrls = {
  auth: {
    signin: "/auth/signin",
    signup: "/auth/signup",
  },
  board: {
    all: "/boards",
    create: "/boards/create",
    data: "/boards/",
    changeMembers: "/boards/changemembers/",
    edit: "/boards/edit/",
    delete: "/boards/delete/"
  },
  task: {
    all: "/lists/",
    create: "/lists/create",
    edit: "/lists/edit/",
    delete: "/lists/delete/",
  },
  card: {
    all: "/cards/",
    create: "/cards/create",
    edit: "/cards/edit/",
    delete: "/cards/delete/",
    move: "/cards/move/"
  },
  profile: {
    info: "/users",
    search: "/users/search"
  },
  comment: {
    create: "/comments/create",
    delete: "/comments/delete/",
    all: "/comments/card/"
  },
  activity: {
    create: "/activity/create",
    board: "/activity/board/",
    card: "/activity/board/"
  }
};
