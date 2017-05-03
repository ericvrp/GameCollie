import React from 'react';
import { Link } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

export default class Ingest extends React.Component {
  componentDidMount() {
  }

  ingestFiles(event) {
    event.preventDefault();

		const itemHashes = [
		  {"path":"./gba/0001 - F-Zero for GameBoy Advance (J)(Mr. Lee)/0001 - F-Zero for GameBoy Advance (J)(Mr. Lee).gba", "sha256":"0x86C5E12E6C9C946A2E3FDA7BDDAC25455C2CF0C6E78D4AF9108714A5BBADEE4E", "md5":"0x0915AC62D58A160028EB47141657013F", "crc32":"0x25E3FC9A"},
		  {"path":"./n64/Banjo-Tooie (U) [!].v64", "sha256":"0x9EC37FBA6890362EBA86FB855697A9CFF1519275531B172083A1A6A045483583", "md5":"0x40E98FAA24AC3EBE1D25CB5E5DDF49E4", "crc32":"0xBAB803EF"},
		  {"path":"./n64/Banjo-Tooie (U) [!].z64", "sha256":"0x9EC37FBA6890362EBA86FB855697A9CFF1519275531B172083A1A6A045483583", "md5":"0x40E98FAA24AC3EBE1D25CB5E5DDF49E4", "crc32":"0xBAB803EF"},
		  {"path":"./n64/Donkey Kong 64 (U) [!].v64", "sha256":"0x5778C9EF72EF269CDCC52333710A79961A343B1F01D12189D1DBE94DF3CBABED", "md5":"0xB71A88BA73E141FA2D355A6A72F46F6C", "crc32":"0x96972D67"},
		  {"path":"./n64/Donkey Kong 64 (U) [!].z64", "sha256":"0xB6347D9F1F75D38A88D829B4F80B1ACF0D93344170A5FBE9546C484DAE416CE3", "md5":"0x9EC41ABF2519FC386CADD0731F6E868C", "crc32":"0xD44B4FC6"},
		  {"path":"./n64/Dr. Mario 64 (U) [!].v64", "sha256":"0x613778B244784492A881C0D72D6017F82C39026706A406BD7EF95C6F33E53B89", "md5":"0x30EC4F3E1C435ED8B1D1FD3788B6A407", "crc32":"0xF7C44B5B"},
		  {"path":"./psx/Crash Bandicoot 2/Crash 2.bin", "sha256":"0xA2E2AB37CD6E0D5180876BF7786AC699B3B691208EFE8DE66AFE7779BF4D1605", "md5":"0x3C31B5E038F025098A2FDFA70C8213F2", "crc32":"0x395C0916"},
		  {"path":"./psx/Crash Bandicoot 2/Crash 2.cue", "sha256":"0xBE5587C93CB4180FE6156DCB931EFC81F2DBBFE491018E5E8F7C9F81DC15A93B", "md5":"0xCAFB479A95A1F2880C1C61B4796A665C", "crc32":"0xA0BE515F"},    
		  ];

		  for(i=0;i<itemHashes.length;i++) {
		  	var item = itemHashes[i];
		  	var data = {
		  		path:item.path, 
		  		hash_sha256:item.sha256, 
		  		hash_md5:item.md5, 
		  		hash_crc32:item.crc32
		  	};

		  	Meteor.call('files.upsert', data);
		  }
	}

  render() {
    return (
      <div className="IngestFiles">
        <Row>
          <Col xs={ 12 } sm={ 6 } md={ 4 }>
            <h4 className="page-header">Import File</h4>
	          <Button type="submit" bsStyle="success" onClick={this.ingestFiles}>Ingest</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
