import { Link } from "react-router-dom"
import { SecurityI } from "../components/SecurityI"

  export type SecurityItem = {
        title: string,
        description: string
    }

export function Security() {

    const securityInfo:SecurityItem[] = [
        {
            title: "Default Campaign",
            description: "Upon signup you will automatically be added to an example campaign to showcase the features of the application. This campaign is a strictly sandboxed environment. The analytics are read-only and immutable to users via RBAC, allowing users to safely test AI insight features, view graph capabilities, etc."
        },
        {
            title: "Password Hashing",
            description: "User privacy and system security are enforced at the database level. Passwords are never stored in plain text; instead, they are passed through a salted bcrypt hashing algorithm on the server before entering persistent storage. This ensures authorization credentials are unreadable, even in the event of direct database administrative access."
        },
        {
            title: "Session Control",
            description: "Authentication state validation is securely managed via server-issued JWT tokens. Rather than storing tokens in vulnerable client-side LocalStorage, sessions are bound directly to cross-subdomain HTTP-Only cookies. Configured with strict 'SameSite=Strict' and 'Secure' attributes, this structure isolates the token from browser scripts, completely eliminating standard XSS and CSRF attack vectors."
        },
        {
            title: "Backend Security",
            description: "The core infrastructure utilizes an isolated multi-container architecture via Docker Compose deployed on a Linux VPS. The storage database is entirely unexposed to the public, accessed exclusively via the internal container bridge network. All incoming API traffic is forced through an Nginx reverse proxy gateway hardened with Certbot SSL/TLS encryption, ensuring secure data transit across all client-server cycles."
        }
    ]
    
    return (
        <>

            <div className="mx-auto lg:px-12 py-6">
            <Link to={"/"} className="text-lg hover:bg-indigo-100 rounded-lg duration-150 px-3 py-1.5"><i className="fa-solid fa-arrow-left text-indigo-600"></i> Back to signup</Link>
            </div>

            <section className="max-w-5xl mx-auto p-6">
                <h1 className="text-3xl font-semibold mt-24">Security & Architecture</h1>

                <div className="bg-white p-6 mt-12 rounded-lg shadow-lg border border-slate-50">
                    <div className="flex flex-col gap-8">
                        { securityInfo.map(item => (
                            <SecurityI SecurityItem={item} key={item.title}/>
                        ))

                        }
                    </div>
                </div>
            </section>
        
        </>
    )
}