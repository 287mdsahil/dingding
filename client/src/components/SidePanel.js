function ContactCard() {
    return (
        <div style={{
            padding: 10,
            borderBottom: 'solid',
            borderWidth: 1,
            borderColor: 'var(--surface)',
        }}>
            Dummy Contact
        </div>
    );
}

function Sidepanel() {
    return (
        <div style={{
            background: 'var(--background)', 
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 2,
            overflowY: 'auto',
    		scrollbarColor: 'var(--surface) transparent',
        }}>
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
        </div>
    );
}

export default Sidepanel;
