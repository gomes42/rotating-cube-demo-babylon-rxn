/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, {useCallback} from 'react';
import {Behavior, Color3, Color4, Engine, HemisphericLight, Mesh, MeshBuilder, Node, Nullable, Observer, Scene, StandardMaterial, UniversalCamera, Vector3} from '@babylonjs/core';
import {StatusBar, View} from 'react-native';
import GLRenderer from './components/GLRenderer';

export default function App() {
  const onCreateEngine = useCallback((engine: Engine | undefined) => {
    if (!engine) return;

    const scene = new Scene(engine);

    scene.clearColor = Color4.FromHexString(`#00CBF1`);

    const camera = new UniversalCamera('camera', new Vector3(0, 3, -5), scene);
    camera.setTarget(Vector3.Zero());

    const light = new HemisphericLight('HemiLight', new Vector3(0, 9, -5), scene);

    const box = MeshBuilder.CreateBox('Cube', {size: 1});
    const boxMaterial = new StandardMaterial('CubeMaterial', scene);
    boxMaterial.diffuseColor = Color3.FromHexString('#0081fe');
    box.material = boxMaterial;

    box.position.set(0, 0, 0);
    box.addRotation(0.1, 0.5, 0);

    const RotationBehaviour: Behavior<Node> & {
      observer?: Nullable<Observer<any>>;
    } = {
      name: 'RotationBehaviour',
      init: function (): void {},
      attach: function (target: Node): void {
        RotationBehaviour.observer = scene.onBeforeRenderObservable.add(() => {
          (target as Mesh).addRotation(0, engine.getDeltaTime() * 0.001, 0);
        });
      },
      detach: function (): void {}
    };

    box.addBehavior(RotationBehaviour);

    engine.runRenderLoop(function () {
      if (scene && scene.activeCamera) scene.render();
    });

    return () => {
      scene.dispose();
      camera.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000000',
        position: 'absolute',
        width: '100%',
        height: '100%'
      }}
    >
      <StatusBar backgroundColor={'#0DDDF2'} />
      <GLRenderer onCreateEngine={onCreateEngine} />
    </View>
  );
}
