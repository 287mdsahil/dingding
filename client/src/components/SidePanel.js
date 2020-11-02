import {useState}  from 'react';
import {useCookies} from 'react-cookie';

function ContactCard(props) {
    return (
        <div style={{
            padding: 10,
            borderBottom: 'solid',
            borderWidth: 1,
            borderColor: 'var(--surface)',
        }}>
            {props.cid}
        </div>
    );
}

function Sidepanel() { 

    const [connections, setConnections] = useState(null);
	const [cookies] = useCookies(["id"]);

    var fetchConnections = () => { 
		fetch("http://localhost:5000/user/"+cookies.id+"/connections")
			.then(response => {
				if (!response.ok) {
					console.log("Failed with HTTP code: " + response.status);
                    return {};
				} else {
                    return response.json();
				}
			}).then(data => {
                console.log(connections);
                if(connections == null)
                    setConnections(data);
			});
    };
    fetchConnections();

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
            {connections!=null &&
                connections.map((cid,index) => {
                    return <ContactCard cid={cid} key={index} />
                })
            }
        </div>
    );
}

export default Sidepanel;
