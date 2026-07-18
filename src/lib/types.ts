export interface Blog {
  blogId: number
  title: string
  description: string
  creationDate: string
  numReactions: number
  creatorId: number
  creatorFirstName: string
  creatorLastName: string
  cityId: number
  categoryIds: number[]
  series?: string
}

export interface BlogDetail extends Blog {
  numberOfUniqueCommenters: number
}

export interface BlogReaction {
  userId: number
  reaction: 'REACTION_1' | 'REACTION_2' | 'REACTION_3' | 'REACTION_4' | 'REACTION_5'
}

export interface BlogComment {
  commentId: number
  commenterId: number
  comment: string
  commenterFirstName: string
  commenterLastName: string
  timestamp: string
  parentId: number | null
}

export interface Category {
  categoryId: number
  name: string
}

export interface City {
  cityId: number
  name: string
}

export interface BlogListResponse {
  blogs: Blog[]
  count: number
}