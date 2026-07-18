export interface Blog {
  blogId: number
  title: string
  description: string
  creationDate: string
  numReactions: number
  creatorFirstName: string
  creatorLastName: string
  city: string
  categories: string[]
  series?: string
  numberOfUniqueCommenters: number
  image: string
  comments?: BlogComment[]
  reactions?: BlogReactionCount[]
}

export interface BlogReactionCount {
  reaction: 'REACTION_1' | 'REACTION_2' | 'REACTION_3' | 'REACTION_4' | 'REACTION_5'
  count: number
}

export interface BlogComment {
  commentId: number
  comment: string
  commenterFirstName: string
  commenterLastName: string
  timestamp: string
  parentId: number | null
}