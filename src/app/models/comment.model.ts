export class Comment{
    id: number
    comment: string
    questionId: number
    userId: number
    username: string
    commentedAt: Date
    votes?: number
    votesBy?: number[]
}