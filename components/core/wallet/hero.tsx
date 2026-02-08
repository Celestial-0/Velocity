export const Hero = () => {
    return (
        <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">
                Welcome to Velocity
            </h1>
            <p className="max-w-4xl mx-auto text-xl text-muted-foreground">
                A minimal, secure, and blazing fast web wallet for the Solana blockchain.
                <br />
                Generate seed phrases, derive accounts, and view your on-chain assets.
            </p>
        </div>
    );
};
