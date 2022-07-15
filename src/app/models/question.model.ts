export class Question{
    id: number
    title: string
    body: string
    userId: number
    createdAt: Date
    numberOfNewComments: number
    votes: number
    votesBy: number[]
}