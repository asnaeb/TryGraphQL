import React from 'react'
import {formatGQL} from './formatGQL'
import styles from './style.module.css'

interface GraphQLResponse {
    data: any
    errors: Error[] | null
    loading: boolean
}

export function TryGraphQL() {
    const emptyResponse: GraphQLResponse = { data: undefined, loading: false, errors: null }
    const [graphQLResponse, setGraphQLResponse] = React.useState<GraphQLResponse>(emptyResponse)
    const [query, setQuery] = React.useState('')
    const [endpoint, setEndpoint] = React.useState('')

    async function sendQuery(query: string) {
        if (query) {
            setGraphQLResponse({...emptyResponse, loading: true })
            try {
                const response = await fetch(endpoint, {
                    body: JSON.stringify({
                        query
                    }),
                    method: 'POST',
                    headers: { 'content-type': 'application/json' }
                })
                const parsed = await response.json()
                setGraphQLResponse({ loading: false, ...parsed })
            } catch (error: any) {
                setGraphQLResponse({ ...emptyResponse, errors: [error] })
            }
        }
    }

    function Response() {
        function format(obj: Record<string, any>, tab = '    '): string {
            if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                const newspace = tab + '    '
                return '{\n' 
                + Object.keys(obj).map(k => `${tab}${k}: ${format(obj[k], newspace)}`).join(',\n') 
                + '\n' + tab.substring(4) + '}'
            } 

            return JSON.stringify(obj)
        }

        if (graphQLResponse.data) {
            const k = Object.keys(graphQLResponse.data)[0]
            const v = graphQLResponse.data[k]
            return <code>
                <b>{k}</b>.data: {format(v)}
            </code>
        }

        if (graphQLResponse.errors) {
            return <code>
                <b>error</b>: {graphQLResponse.errors.map(e => e.message)}
            </code>
        }

        if (graphQLResponse.loading) { 
            return <code>loading...</code>
        }

        return <code></code>
    }

    return <div className={styles.mainwrapper}>
        <div className={styles.querywrapper}>
            <div className={styles.contentwrapper}>
                <div className={styles.box}>
                    <textarea className={styles.content} value={query} onChange={({ target }) => formatGQL(target, setQuery)}/>
                    <div className={styles.endpointwrapper}>
                    <input id={styles.endpoint} type='text' placeholder='endpoint url' value={endpoint} onChange={({ target }) => setEndpoint(target.value)}/>
            </div>
                </div>
                <div className={styles.box}> 
                    <div className={graphQLResponse.errors ? `${styles.content} ${styles.error}` : styles.content}>
                        <Response/>
                    </div>
                </div>
            </div>
            
            <div className={styles.buttonwrapper}>
                <button disabled={ query ? false : true } onClick={() => sendQuery(query)}>Send</button>
                {(graphQLResponse.data || graphQLResponse.errors || endpoint) && !graphQLResponse.loading && <button className={styles.clear} onClick={() => { setGraphQLResponse(emptyResponse); setQuery(''); setEndpoint('')}}>Reset</button>}
            </div>
        </div>
    </div>
}