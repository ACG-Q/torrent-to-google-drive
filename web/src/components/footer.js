import React from "react";

function footer() {
	return (
		<div className="nav">
			<div className="content">
				<div className="nav-logo">
					<h1 className="h4 m-0">Copyright @ 2021.
                        <a className="alpha" href="https://github.com/ACG-Q/torrent-to-google-drive">CyberTOR-Beta</a>
					</h1>
				</div>
				<div className="nav-links" style={{flexDirection: "row"}}>
					<a className="btn" href="https://github.com/ACG-Q" style={{color: "#f7fafc"}}>
                        <span className="bnt-icon">
                            <ion-icon name="logo-github"/>
                        </span> Github
					</a>
				</div>
			</div>
		</div>
	);
}

export default footer;
