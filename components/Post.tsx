import * as React from 'react'

type Props = {
    title?: string
}

const Post: React.FunctionComponent<Props> = ({
    children,
    title = 'This is the default title',
}) => (
    <Post title={title}>

        <div className="container grid-lg">
            <div className="columns">
                <div className="column col-12">
                    <h1>{title}</h1>
                </div>
            </div>

            <div className="columns">
                {children}
            </div>
        </div>
    </Post>
)

export default Post
