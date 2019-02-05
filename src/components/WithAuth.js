import React from 'react';

const WithAuth = (WrappedComponent) => (
    class WithAuth extends React.Component {
        componentDidMount = () => {
            console.log('hello I mounted!', this.props)
        }

        render() {
            return (
                <WrappedComponent {...this.props} />
            )
        }
    }
)

export default WithAuth